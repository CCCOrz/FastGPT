import React, { useState } from 'react';
import { Box, type BoxProps, Flex, Textarea, useTheme } from '@chakra-ui/react';
import MyRadio from '@/components/Radio/index';
import dynamic from 'next/dynamic';

import ManualImport from './Import/Manual';


const ChunkImport = dynamic(() => import('./Import/Chunk'), {
  ssr: true
});
const QAImport = dynamic(() => import('./Import/QA'), {
  ssr: true
});
const CsvImport = dynamic(() => import('./Import/Csv'), {
  ssr: true
});

enum ImportTypeEnum {
  manual = 'manual',
  index = 'index',
  qa = 'qa',
  csv = 'csv'
}

export enum ContentTypeEnum {
  normal = 'normal',
  chat = 'chat',
  feedback = 'feedback'
}

const ImportData = ({ kbId }: { kbId: string }) => {
  const theme = useTheme();
  const [importType, setImportType] = useState<`${ImportTypeEnum}`>(ImportTypeEnum.qa);
  const TitleStyle: BoxProps = {
    fontWeight: 'bold',
    fontSize: ['md', 'xl'],
    mb: [3, 5]
  };

  const [contentType, setContentType] = useState<`${ContentTypeEnum}`>(ContentTypeEnum.normal);

  return (
    <Flex flexDirection={'column'} h={'100%'} pt={[1, 5]}>
      <Box {...TitleStyle} px={[4, 8]}>
        数据导入方式
      </Box>
      <Box pb={[5, 7]} px={[4, 8]} borderBottom={theme.borders.base}>
        <MyRadio
          gridTemplateColumns={['repeat(1,1fr)', 'repeat(2, 350px)']}
          list={[
            {
              icon: 'qaImport',
              title: 'QA拆分',
              desc: '选择文本文件，让大模型自动生成问答对',
              value: ImportTypeEnum.qa
            },
            // {
            //   icon: 'manualImport',
            //   title: '手动输入',
            //   desc: '手动输入问答对，是最精准的数据',
            //   value: ImportTypeEnum.manual
            // },
            // {
            //   icon: 'indexImport',
            //   title: '直接分段',
            //   desc: '选择文本文件，直接将其按分段进行处理',
            //   value: ImportTypeEnum.index
            // },
            // {
            //   icon: 'csvImport',
            //   title: 'CSV 导入',
            //   desc: '批量导入问答对，是最精准的数据',
            //   value: ImportTypeEnum.csv
            // }
          ]}
          value={importType}
          onChange={(e) => setImportType(e as `${ImportTypeEnum}`)}
        />
      </Box>

      {
        importType === ImportTypeEnum.qa && 
        <Box>
          <Box {...TitleStyle} px={[4, 8]} mt={5}>
            内容类型
          </Box>
          <Box pb={[5, 7]} px={[4, 8]} borderBottom={theme.borders.base}>
            <MyRadio
              gridTemplateColumns={['repeat(1,1fr)', 'repeat(2, 350px)']}
              list={[
                {
                  icon: 'uploadFile',
                  title: '常规',
                  desc: '常规内容类型，例如FAQ、说明书、资料文档',
                  value: ContentTypeEnum.normal
                },
                {
                  icon: 'uploadFile',
                  title: '企点对话',
                  desc: '企点导出的聊天记录，自动筛选对话内容',
                  value: ContentTypeEnum.chat
                },
                {
                  icon: 'uploadFile',
                  title: '玩家反馈',
                  desc: '客服后台玩家反馈回复信息',
                  value: ContentTypeEnum.feedback
                }
              ]}
              value={contentType}
              onChange={(e) => {
                setContentType(e as `${ContentTypeEnum}`)
              }}
            />
          </Box>
        </Box>
      }
      

      <Box flex={'1 0 0'} h={0}>
        {importType === ImportTypeEnum.manual && <ManualImport kbId={kbId} />}
        {importType === ImportTypeEnum.index && <ChunkImport kbId={kbId} />}
        {importType === ImportTypeEnum.qa && contentType === ContentTypeEnum.normal && <QAImport kbId={kbId} contentType={contentType as ContentTypeEnum} />}
        {importType === ImportTypeEnum.qa && contentType === ContentTypeEnum.chat && <QAImport kbId={kbId} contentType={contentType as ContentTypeEnum} />}
        {importType === ImportTypeEnum.qa && contentType === ContentTypeEnum.feedback && <QAImport kbId={kbId} contentType={contentType as ContentTypeEnum} />}
        {importType === ImportTypeEnum.csv && <CsvImport kbId={kbId} />}
      </Box>
    </Flex>
  );
};

export default ImportData;
