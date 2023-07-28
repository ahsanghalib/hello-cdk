import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

import { config } from "dotenv";
config();

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, "HelloCdkApi", {
      restApiName: `hello-cdk-api-${process.env.STAGE || "offline"}`,
      deployOptions: {
        stageName: process.env.STAGE || "offlinie",
        metricsEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        tracingEnabled: true,
      },
      cloudWatchRole: true,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });

    const helloFn = new lambda.NodejsFunction(this, "HelloFunction", {
      entry: path.resolve(__dirname, "../src/functions/hello.ts"),
      functionName: `hello-cdk-api-${process.env.STAGE || "offline"}`,
      handler: "handler",
      memorySize: 256,
      runtime: Runtime.NODEJS_16_X,
      environment: {
        STAGE: process.env.STAGE || "offline",
      },
      timeout: cdk.Duration.seconds(30),
      tracing: Tracing.ACTIVE,
      bundling: {
        target: "es6",
      },
    });

    const helloLambdaIntegration = new apigateway.LambdaIntegration(helloFn);
    api.root.addMethod("GET", helloLambdaIntegration);
    api.root.addResource("hello").addMethod("GET", helloLambdaIntegration);
  }
}
