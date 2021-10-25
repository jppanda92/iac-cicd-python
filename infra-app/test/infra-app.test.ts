import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as InfraApp from '../lib/infra-app-stack';

test('EC2 Instance Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new InfraApp.InfraAppStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(haveResource("AWS::EC2::Instance",{
      VisibilityTimeout: 300
    }));
});

test('Security Group Rule Attached', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new InfraApp.InfraAppStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResource("AWS::EC2::SecurityGroup"));
});
