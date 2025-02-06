import { Module } from '@nestjs/common';
import { WalletModule } from './wallet/wallet.module';
import { UniswapModule } from './uniswap/uniswap.module';
import { MoonwellModule } from './moonwell/moonwell.module';
import { AerodromeModule } from './aerodrome/aerodrome.module';
import { BalancerSwapModule } from './balancer-swap/balancer-swap.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BridgeModule } from './bridge/bridge.module';
import { TlsOptions } from 'tls';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeOrmConfig from './config/typeprm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig.generator()),
    WalletModule,
    BridgeModule,
    BalancerSwapModule,
    AerodromeModule,
    MoonwellModule,
    UniswapModule,
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (conf: ConfigService): TypeOrmModuleOptions => {
    //     const ssl: boolean | TlsOptions =
    //       conf.get('DATABASE_SSL_DISABLED') === 'true'
    //         ? false
    //         : {
    //           ca: conf.get('SSL_CERT'),
    //           rejectUnauthorized: false,
    //         };
    //     return {
    //       type: 'postgres',
    //       ssl,
    //       url: conf.get('DATABASE_URL'),
    //       entities: ['**/*.entity.js'],
    //       synchronize: false,
    //       logging: false,
    //     };
    //   },
    // }),
  ],
  // controllers: [SwapController, WalletController],
  // providers: [SwapService, WalletService],
})
export class AppModule { }
