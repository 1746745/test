import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

export async function testFunction(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const testBody = {
    name: "items",
  };

  return { body: JSON.stringify(testBody) };
}

app.http("testFunction", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: testFunction,
});
