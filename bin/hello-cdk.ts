#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { HelloCdkStack } from "../lib/hello-cdk-stack";

const app = new cdk.App();
new HelloCdkStack(app, "HelloCdkStack", {
  stackName: `hello-cdk-stack-${process.env.STAGE || ""}`,
  synthesizer: new cdk.DefaultStackSynthesizer({
    qualifier: "hello-cdk",
  }),
  env: {},
});
