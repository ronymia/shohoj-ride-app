import { neon } from "@neondatabase/serverless";

// import { neonConfig, Pool } from '@neondatabase/serverless';
// import { WebSocket } from 'ws';

// const connectionString = `${process.env.DATABASE_URL}`;

// neonConfig.webSocketConstructor = WebSocket;
// neonConfig.poolQueryViaFetch = true;

// const pool = new Pool({ connectionString });

export async function POST(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const { name, email, clerkId } = await request.json();

  if (!name || !email || !clerkId) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  try {
    const result = await sql`
      INSERT INTO users (name, email, clerk_id)
      VALUES (${name}, ${email}, ${clerkId})
      RETURNING id, name, email, clerk_id
    `;

    const user = result[0];

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.log("Error inserting user:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
