import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisConfig {
  private redisClient: Redis;

  constructor(private configService: ConfigService) {
    this.redisClient = new Redis({
      db: this.configService.get<number>('REDIS_DBNAME'),
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      //클라이언트가 필요할때마다 연결
      lazyConnect: this.configService.get<boolean>('REDIS_LAZY_CONNECT'),
    });
    this.initialize();
  }

  private async initialize() {
    try {
      await this.redisClient.ping();
      console.log('레디스 연결 성공');
    } catch (error) {
      console.error('Redis connection error:', error);
    }
  }

  getClient(): Redis {
    return this.redisClient;
  }
}
