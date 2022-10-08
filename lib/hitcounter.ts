import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib';

export interface HitCounterProps {
    /** the function for which we want to count url hits **/
    downstream: IFunction;
}

export class HitCounter extends Construct {
    public readonly handler: IFunction;
    constructor(scope: Construct, id: string, props: HitCounterProps) {
        super(scope, id);
        const table = new Table(this, 'Hits', {
            partitionKey: { name: 'path', type: AttributeType.STRING },
            //Note: プロダクションではDBテーブルは保持することが多いが今回はハンズオン用にDestroy
            removalPolicy: RemovalPolicy.DESTROY
        });
    this.handler = new NodejsFunction(this, 'HitCounterHandler', {
        runtime: Runtime.NODEJS_16_X,
        entry: 'lambda/hitcounter.ts',
        environment: {
            DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
            HITS_TABLE_NAME: table.tableName,
        },
    });
    
    // Lambda関数に対してテーブルを読み書き/別のLambdaを実行する権限を付与
    // CDKでは[grant]を利用してリソースに権限を付与できる
    table.grantReadWriteData(this.handler);
    props.downstream.grantInvoke(this.handler);
    }
}