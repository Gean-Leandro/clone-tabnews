import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const versionDatabaseResult = await database.query("SHOW server_version;");
  const versionDatabaseValue = versionDatabaseResult.rows[0].server_version;
  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );

  const databaseName = process.env.POSTGRES_DB;
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;
  const usedConnectionsResult = await database.query({
    text: "SELECT count(*)::int used FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const usedConnectionsValue = usedConnectionsResult.rows[0].used;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: versionDatabaseValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        used_connections: usedConnectionsValue,
      },
    },
  });
}

export default status;
