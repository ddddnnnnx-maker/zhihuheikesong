// Private adjudication notes. These calibrate the host without changing the
// published soup surfaces or revealing answers through /api/cases.
export const JUDGE_CALIBRATION = {
  origin: {
    boundaries: [
      '主人公是人；能力不是时间操纵，时间跨度只是推理线索。',
      'A市所指向的地点及寻亲失败的求助者都与真相有关；问“重要吗”是在问相关性，可以回答是或否。',
      '故事涉及死亡，但没有鬼；主人公尝血帮助寻亲，不是出于吃人的爱好，也没有被设定为坏人。',
      '寻亲失败的求助者不是故事中的杀人者；不要把故事未提到的私人经历、家庭状况或主持人的生活当成谜底。',
      '“我能帮人找到亲人”只部分成立：题面有成功和失败的求助者，能力实际指向提供血液的人。'
    ],
    examples: [
      ['我是人吗', 'YES'], ['A市在哪里重要吗', 'YES'],
      ['我的超能力和时间有关吗', 'NO'], ['我有吃人的爱好吗', 'NO'],
      ['我是坏人吗', 'NO'], ['寻亲失败的那些人重要吗', 'YES'],
      ['寻亲失败的人杀人了吗', 'NO'], ['故事里有人死吗', 'YES'],
      ['故事里有鬼吗', 'NO'], ['你吃饭了吗', 'IRRELEVANT'],
      ['我有家人吗', 'IRRELEVANT'],
      // The screenshot truncates this question; this is a representative
      // complete phrasing, not a verbatim transcription of the source row.
      ['我能帮人找到他们的亲人吗', 'PARTIAL']
    ]
  },
  'silent-game': {
    boundaries: [
      '公司与童年带走姐姐的拐卖生意是同一个组织或犯罪链条；但不确定现任员工是否就是当年的具体闯入者。',
      '公司问精确出生时辰、安排体检，是为核查、筛选和利用主人公；问“是不是核对他与当年被带走的女孩的关系”按故事整体意图回答是。精确时辰本身不是医学配型依据。',
      '主人公的生日不是故事反转的原因；姐姐后来是否死亡、父母是否离异均未设定，也不影响解开本题，应答不相关，而不是索取更多细节。'
    ],
    examples: [
      ['是不是和我的生日有关', 'NO'], ['姐姐是不是死了', 'IRRELEVANT'],
      ['父母离异了吗', 'IRRELEVANT'], ['是不是这家公司当年把姐姐带走了', 'YES'],
      ['这家公司问我具体出生时辰是想知道我是不是当年被他们带走的女孩的弟弟', 'YES']
    ]
  }
};
