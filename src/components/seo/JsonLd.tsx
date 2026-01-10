/**
 * JSON-LD Structured Data Component
 *
 * Renders schema.org structured data in <script type="application/ld+json">
 *
 * Usage:
 * <JsonLd data={schemaObject} />
 * <JsonLd data={[schema1, schema2]} />
 */

interface JsonLdProps {
  data: Record<string, any> | Array<Record<string, any>>;
}

export default function JsonLd({ data }: JsonLdProps) {
  // Handle both single schema and array of schemas
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0), // Minified JSON
          }}
        />
      ))}
    </>
  );
}
