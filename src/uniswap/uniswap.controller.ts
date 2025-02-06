import { Body, Controller, Post } from '@nestjs/common';
import { UniswapService } from './uniswap.service';
import { WalletService } from '../wallet/wallet.service';

@Controller('uniswap')
export class UniswapController {

    constructor(private readonly uniswapService: UniswapService, private readonly walletService: WalletService) { }

    @Post('/')
    async swap(@Body() data: object): Promise<object> {
        let private_key = await this.walletService.GetPrivateKeyByAddress(data["address"])

        console.log(private_key)

        await this.uniswapService.swap(private_key, data["recipient"], data["amountIn"])
        return
    }
}
