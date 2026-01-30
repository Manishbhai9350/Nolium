import { SendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

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

    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      respondentEmail: body.respondentEmail,
      responses: body.responses,
      raw: body,
    };

    await SendWorkflowExecution({
      workflowId,
      initialData:{
        googleForm:formData
      }
    })

    return NextResponse.json({
      message:'Google Form Handled Successfully',
      success:true
    },{
      status:200
    })
  } catch (error) {
    console.log("Google Form Submission Error: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process Google Form Submission",
      },
      {
        status: 500,
      },
    );
  }
}
