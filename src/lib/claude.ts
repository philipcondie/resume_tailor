import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { LLMInput, LLMOutputSchema, LLMOutput } from "../types/resume";
import { systemPrompt } from "./prompts";

export async function tailorResume(apiKey:string, input: LLMInput): Promise<LLMOutput>{
    
    // create prompt
    const prompt: string = `
        ${input.userInstructions && 
        `<user_instructions>
            ${input.userInstructions}
        </user_instructions>`}   
        <job_description>
            ${input.jobDescription}
        </job_description>

        <general_information>
            ${input.info.generalInfo}
        </general_information>

        <job_history>
            ${input.jobs.map(job => (
                `<job_id>${job.id}</job_id>
                <company>${job.company}</company>
                <job_title>${job.role}</job_title>
                <location>${job.location}</location>
                <start_date>${job.startDate}</start_date>
                <end_date>${job.endDate}</end_date>
                ${job.bullets.map(bullet =>(
                    `<bullet>${bullet}</bullet>`
                ))}
                `
            ))}
        </job_history
    `
    
    const client = new Anthropic({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    });

    const response = await client.messages.parse({
        model: "claude-opus-4-6",
        max_tokens:5096,
        system: systemPrompt,
        thinking: {type: "adaptive"},
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        output_config: {
            effort: "medium",
            format: zodOutputFormat(LLMOutputSchema),
        }
    });

    return response.parsed_output!
}