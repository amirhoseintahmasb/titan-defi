export class WalletDto {
  address: string;
  coinType: number;
  account: number;
  change: number;
  index: number;
  id?: string;
}

export class ServiceResponse {
  success: boolean;
  data: object;
  error: any;
}
