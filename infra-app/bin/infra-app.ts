#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { InfraAppStack } from '../lib/infra-app-stack';

const app = new cdk.App();
new InfraAppStack(app, 'InfraAppStack', 
    {
        env: {
            account: process.env.CDK_DEFAULT_ACCOUNT,
            region: process.env.CDK_DEFAULT_REGION,
        },
    }
);
