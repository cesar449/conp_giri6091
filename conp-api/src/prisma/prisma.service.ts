import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    constructor() {
        // npm i @prisma/adapter-pg pg 
        // npm i dotenv --save-dev
        const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

        super({ adapter});
    }

    async onModuleInit() {
        await this.$connect();

    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

}

//! git commit -m "add: Uso de Prisma ORM y configuracion de servicios y modulos"