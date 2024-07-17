import { type NextRequest, NextResponse } from "next/server";
import { RunEventType, type RunOpts } from "@gptscript-ai/gptscript";
import g from "@/lib/gptScriptInstance";

const script = 'app/api/run-script/story-book.gpt'
export const POST = async (req: NextRequest) => {
	const { story, pages, path } = await req.json();

	const opts: RunOpts = {
		disableCache: true,
		input: `--story ${story} --pages ${pages} --path:${path}`,
	};

	try {
		const encoder = new TextEncoder();
		const stream = new ReadableStream({
			async start(controller) {
				try {
          const run = await g.run(script,opts)

          run.on(RunEventType.Event ,data =>{
            controller.enqueue(
              encoder.encode( `event: ${JSON.stringify(data)}\n\n`)
            )
          })

          await run.text()
          controller.close()
					// biome-ignore lint/correctness/noUnreachable: <explanation>
				} catch (error) {
					controller.error(error);
					console.log("Error:", error);
				}
			},
		});

    return new Response(stream ,{
      headers:{
        'Content-Type':'text/event-stream',
        'Cache-Control':'no-cache',
        Connection:'keep-alive'
      }
    })

		// biome-ignore lint/correctness/noUnreachable: <explanation>
	} catch (error) {
		return new NextResponse(JSON.stringify({ error: error }), { status: 500 });
	}
};
