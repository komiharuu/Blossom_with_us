import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeOrmModuleOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    const dbHost = configService.get<string>('DB_HOST');
    const dbPort = configService.get<number>('DB_PORT');
    const dbUser = configService.get<string>('DB_USER');
    const dbPassword = configService.get<string>('DB_PASSWORD');
    const dbName = configService.get<string>('DB_NAME');
    return {
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      username: dbUser,
      password: dbPassword,
      database: dbName,
      synchronize: true,
      entities: ['dist/**/*.entity.js'],
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      namingStrategy: new SnakeNamingStrategy(),
    };
  },
};
