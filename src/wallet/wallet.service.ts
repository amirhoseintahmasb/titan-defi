import { Injectable } from "@nestjs/common";
import { initWasm } from "@trustwallet/wallet-core";
import { ServiceResponse, WalletDto } from "./dto/wallet.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { WalletEntity } from "./entities/wallet.entity";
import { Repository } from "typeorm";

@Injectable()
export class WalletService {
  WalletAccount: number;
  WalletChange: number;

  public Wallet;
  public CoinType;
  public HexCoding;
  public HDWallet;
  public AnyAddress;
  public Purpose;
  public HDVersion;
  public BitcoinScript;
  public BitcoinSigHashType;
  public AnySigner;
  public PrivateKey;
  public Curve;
  public EthereumChainID;

  constructor(
    @InjectRepository(WalletEntity)
    private readonly repo: Repository<WalletEntity>
  ) {
    this.WalletAccount = 1;
    this.WalletChange = 0;
    this.init();
  }

  async init() {
    const {
      CoinType,
      HexCoding,
      HDWallet,
      AnyAddress,
      Purpose,
      HDVersion,
      BitcoinScript,
      BitcoinSigHashType,
      AnySigner,
      PrivateKey,
      Curve,
      EthereumChainID,
    } = await initWasm();
    this.CoinType = CoinType;
    this.HexCoding = HexCoding;
    this.HDWallet = HDWallet;
    this.AnyAddress = AnyAddress;
    this.Purpose = Purpose;
    this.BitcoinScript = BitcoinScript;
    this.HDVersion = HDVersion;
    this.BitcoinSigHashType = BitcoinSigHashType;
    this.AnySigner = AnySigner;
    this.PrivateKey = PrivateKey;
    this.Curve = Curve;
    this.EthereumChainID = EthereumChainID;

    this.Wallet = HDWallet.createWithMnemonic(
      "cream pioneer high female trigger stool slab museum garlic gym dentist stumble",
      "sdfsdfsdfsfsdf"
    );
  }

  public GetCoinMapper(coinName: string): any {
    type ObjectKey = keyof typeof this.CoinType;
    const myVar = coinName as ObjectKey;
    return this.CoinType[myVar];
  }

  public CheckCoin(coinName: string): boolean {
    return this.CoinType.hasOwnProperty(coinName);
  }

  public async GetHotWalletAddressByCoinName(
    coinName: string
  ): Promise<WalletDto> {
    try {
      const coin = this.GetCoinMapper(coinName);

      let index = await this.requestWalletIndex(coin.value);

      const newPrv = this.Wallet.getDerivedKey(
        coin,
        this.WalletAccount,
        this.WalletChange,
        index
      );

      const newPub = newPrv.getPublicKey(coin);
      const address = this.AnyAddress.createWithPublicKey(
        newPub,
        coin
      ).description();

      const wallet = new WalletEntity();
      wallet.address = address;
      wallet.account = this.WalletAccount;
      wallet.change = this.WalletChange;
      wallet.index = index;
      wallet.coinType = coin.value;
      await this.repo.save(wallet);

      return {
        account: this.WalletAccount,
        address,
        change: this.WalletChange,
        coinType: coin.value,
        index,
        id: wallet.id,
      };
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async AddressRequest(coinName: string): Promise<ServiceResponse> {
    try {
      const wallet = await this.GetHotWalletAddressByCoinName(coinName);

      if (!wallet) {
        throw new Error("hot wallet generation failed");
      }

      return {
        success: true,
        data: wallet,
        error: "",
      };
    } catch (error) {
      return {
        success: false,
        data: {},
        error,
      };
    }
  }

  // user wallet database oprations
  private async requestWalletIndex(coinType: number): Promise<number> {
    try {
      let query = this.repo
        .createQueryBuilder("wallets")
        .where("wallets.coinType = :coinType", { coinType })
        .select("MAX(wallets.index)", "max");
      const result = await query.getRawOne();

      if (result.max == null) {
        return 1;
      }

      return result.max + 1;
    } catch (error) {
      return 0;
    }
  }

  async GetPrivateKeyByAddress(address: string): Promise<string> {
    try {
      // get wallet from database using wallet address
      let wallet = await this.repo.findOne({
        where: {
          address,
        },
      });

      const coin = this.GetCoinMapper("ethereum");
      // generate private key
      const rawprv = this.Wallet.getDerivedKey(
        coin,
        wallet.account,
        wallet.change,
        wallet.index
      ).data();

      let prv = "";
      rawprv.forEach((element) => {
        let hex = element.toString(16);
        if (hex.length == 1) {
          prv += "0" + hex;
        } else {
          prv += hex;
        }
      });

      return prv;
    } catch (error) {
      console.log(error.toString());
      return;
    }
  }
}
