import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { HitCounter } from './hitcounter';

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    // AWS Lmambda リソース定義
    const hello = new NodejsFunction(this, 'HelloHandler', {
      runtime: Runtime.NODEJS_16_X,//実行環境
      entry: 'lambda/hello.ts', //エントリーファイル
    });
    
    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello,
    });

    //"hello" 関数をバックに持つAPI Gateway REST API リソースを定義
    new LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler,
    });
  }
}
