import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString,  ValidateNested } from "class-validator";

export class CreateOpenaiDto {

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChatCompletionResponse)
    messages: ChatCompletionResponse[];
}



export class ChatCompletionResponse {

    @IsString()
    @IsNotEmpty()
   role: string;

   @IsString()
   @IsNotEmpty()
   content: string;
}