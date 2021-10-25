import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { Instance, IVpc, SecurityGroup } from '@aws-cdk/aws-ec2';
import { CfnOutput } from '@aws-cdk/core';

export class InfraAppStack extends cdk.Stack {
  private configObj: any;
  private vpc: IVpc;
  private securityGroup: SecurityGroup;
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const jsonFile = resolve(__dirname, "../config/config.json"); 
    const jsonData: string = readFileSync(jsonFile, 'utf8');
    this.configObj = JSON.parse(jsonData);
    
    this.vpc = ec2.Vpc.fromLookup(this, "ExistingVpc", {
      vpcId: this.configObj.vpcId
    })
    
    this.provisionInfra()
  }

  private provisionInfra() {
    this.createSecurityGroup()
    this.createInstance()
  }

  private createSecurityGroup(){

    this.securityGroup = new SecurityGroup(this, "SecurityGroup", {
      vpc: this.vpc,
      description: "Security Group associated to EC2 instance",
      allowAllOutbound: true,
    })

    this.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'SSH from anywhere');
    this.securityGroup.addIngressRule(ec2.Peer.anyIpv4(),ec2.Port.tcp(5000),'Allows HTTP access from Internet')
  }

  private createInstance() {
    const instance = new ec2.Instance(this, 'Instance', {
      vpc: this.vpc,
      securityGroup: this.securityGroup,
      instanceName: this.configObj.instanceName,
      instanceType: new ec2.InstanceType(this.configObj.instanceType),
      machineImage: ec2.MachineImage.latestAmazonLinux({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: "jay"
    })

    instance.instancePublicIp

    new CfnOutput(this, "InstanceId", { value: instance.instanceId})
    new CfnOutput(this, "InstanceHostName", { value: instance.instancePublicDnsName})
    new CfnOutput(this, "InstancePublicIp", { value: instance.instancePublicIp})
  }

  private createKeyPair(){

  }
}
