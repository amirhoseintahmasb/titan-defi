import { Controller, Get } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {

    constructor(private readonly walletService: WalletService) { }

    @Get('/')
    async getUserWallet(): Promise<object> {
        return await this.walletService.AddressRequest("ethereum")
    }

    async getUserWalletBalance() {

    }
}