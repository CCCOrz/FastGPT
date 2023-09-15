import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { authUser } from '@/service/utils/auth';
import { axiosConfig, getAIChatApi } from '@/service/lib/openai';
import { ChatCompletionRequestMessage } from 'openai';
import { gptMessage2ChatType } from '@/utils/adapt';
import { modelToolMap } from '@/utils/plugin';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    let {
      q,
      a,
    } = req.body as {
      kbId: string;
      q: string;
      a: string;
    };

    await authUser({ req, authToken: true });

    const chatAPI = getAIChatApi();

    const response = await (() => {
      const modelTokenLimit = global.qaModel.maxToken || 16000;
      const messages: ChatCompletionRequestMessage[] = [
        {
          role: 'system',
          content: `我会给你发一个问题和一个回答，请你理解这对问答的核心，结合答案想想用户可能还会怎么提类似问题，同时不能偏离问答主题。请丰富问题的多样性，给出至少 5 个相似性的问题，不需要给出答案。\n最后，请按下面的格式返回: Q1:/n\nQ2:/n...\n`,
        },
        {
          role: 'user',
          content: `问题:${q}\n回答${a}`
        }
      ];
      const promptsToken = modelToolMap.countTokens({
        messages: gptMessage2ChatType(messages)
      });
      const maxToken = modelTokenLimit - promptsToken;
      return chatAPI
        .createChatCompletion(
          {
            model: global.qaModel.model,
            temperature: 0.8,
            messages,
            stream: false,
            max_tokens: maxToken
          },
          {
            timeout: 480000,
            ...axiosConfig()
          }
        )
        .then((res) => {
          const answer = res.data.choices?.[0].message?.content;
          const totalTokens = res.data.usage?.total_tokens || 0;
          return answer
        })
        .catch((err) => {
          console.log(err.response?.status, err.response?.statusText, err.response?.data);
          return Promise.reject(err);
        });
    })();

    jsonRes(res, {
      data: response
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
