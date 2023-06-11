import { IoAdapter } from '@nestjs/platform-socket.io';
import { redis } from './redis';
import { createAdapter } from '@socket.io/redis-adapter';
import express from 'express';
import { INestApplicationContext } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  constructor(
    private session: express.RequestHandler,
    app: INestApplicationContext,
  ) {
    super(app);
    this.session = session;
  }

  bindClientConnect(server: any, callback: Function): void {
    server.on('connection', callback);
  }

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    const pubClient = redis;
    const subClient = redis.duplicate();
    const redisAdapter = createAdapter(pubClient, subClient);
    server.adapter(redisAdapter);
    return server;
  }
}
