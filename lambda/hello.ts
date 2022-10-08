export const handler: AWSLambda.APIGatewayProxyHandler = async (event) => {
    console.log("request:", JSON.stringify(event,undefined,2));
    return{
        statusCode:200,
        headers: {"Content-Type": "text/plain"},
        body: `Good Afternoon, CDK you've hit ${event.path}\n`
    };
};