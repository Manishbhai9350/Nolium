import { SendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    console.log(workflowId)

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required query parameter: workflowId",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();

    const stripeData = {
      eventId: body.id,
      eventType: body.type,
      timestamp: body.created,
      livemode: body.livemode,
      raw: body.data?.object,
    };

    SendWorkflowExecution({
      workflowId,
      initialData:{
        stripe:stripeData
      }
    })

    return NextResponse.json({
      message:'Stripe Event Captured',
      success:true
    },{
      status:200
    })
  } catch (error) {
    console.log("Stripe Event Error: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process Stripe Event",
      },
      {
        status: 500,
      },
    );
  }
}
