const {
    BasicTracerProvider,
    SimpleSpanProcessor,
} = require("@opentelemetry/tracing");
// Import the JaegerExporter
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { Resource } = require("@opentelemetry/resources");
const {
    SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");

const opentelemetry = require("@opentelemetry/sdk-node");
const {
    getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

// Create a new instance of JaegerExporter with the options
const exporter = new JaegerExporter({
    serviceName: "node-bixi-counters-trace",
    host: "jaeger", // optional, can be set by OTEL_EXPORTER_JAEGER_AGENT_HOST
});

const provider = new BasicTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]:
            "node-bixi-counters-tracer",
    }),
});
// Add the JaegerExporter to the span processor
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

provider.register();
const sdk = new opentelemetry.NodeSDK({
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();