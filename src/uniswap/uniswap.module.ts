import { Module } from '@nestjs/common';
import { UniswapService } from './uniswap.service';
import { UniswapController } from './uniswap.controller'; 
import { WalletModule } from '../wallet/wallet.module';

@Module({
  providers: [UniswapService],
  controllers: [UniswapController],
  imports: [WalletModule],
})
export class UniswapModule { }
