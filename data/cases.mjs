// surface and truth are verbatim from 海龟汤题库.docx. See tests/fixtures/source-cases.json.
export const CASES = [
  {
    "id": "parcel",
    "mode": "story",
    "number": "S-01",
    "title": "自己取走自己的快递",
    "difficulty": "入门 · 约 5 分钟",
    "hook": "我明明没出门，为什么监控里有人穿着我的睡衣取快递？",
    "subtitle": "一件绿恐龙睡衣，一箱三十斤的猫砂。",
    "surface": "我的快递总自动出现在家门口，没人敲门，没人留话。查监控，取走快递的女人发型、睡衣、拖鞋都和我一样——那套绿恐龙睡衣正是我天天穿的那件。门卫笃定说昨天下午四点多，亲眼看你我自己抱走的快递。可那个下午我在开远程会议，一步没出门。三十斤猫砂，被人抱上了没电梯的四楼。",
    "truth": "是我妈。\n她有我家钥匙，每周来一趟。我常年倒时差，白天睡、清晨吃晚饭，她怕撞上我补觉或开会，就不敲门、不吭声，放下东西就走。她进屋会换掉外衣，顺手穿的就是挂在门后那套绿恐龙睡衣——我天天穿的那一件。而我们的身形和发型本来就像。\n门卫认人不看脸，只认那套睡衣。任何人穿上那套睡衣走过门卫室，在他眼里就是我。\n三十斤猫砂抱上没电梯的四楼，会做这件事又不留名的人，本来只有一个。",
    "twist": "“穿我的睡衣的人”不等于“我本人”；沉默的搬运是母亲的照顾。",
    "unknown": "母亲具体年龄、职业、门卫是否认识母亲、会议内容均未设定。不能推断。",
    "hints": [
      {
        "keyword": "人物身份",
        "guidance": "区分亲眼看到的特征，和据此作出的身份判断。"
      },
      {
        "keyword": "睡衣",
        "guidance": "同一件物品是否只能由一个人使用？"
      },
      {
        "keyword": "不敲门",
        "guidance": "留意动作和动机之间的联系。"
      },
      {
        "keyword": "作息",
        "guidance": "留意汤面中的时间安排，它可能影响人物行动的时机。"
      }
    ],
    "clues": [
      {
        "key": "family",
        "id": "identity",
        "label": "人物身份 · 家人",
        "statement": "搬运者是我的亲人。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "mother",
        "id": "identity",
        "label": "人物身份 · 妈妈",
        "statement": "搬运者是我的母亲。",
        "level": 2,
        "verdict": "YES"
      },
      {
        "key": "not-me",
        "id": "identity-excluded",
        "label": "排除 · 我本人",
        "statement": "搬运者是我本人。",
        "level": 1,
        "verdict": "NO"
      },
      {
        "key": "clothes",
        "id": "clothes",
        "label": "识别依据 · 同一件睡衣",
        "statement": "母亲穿着我那件绿恐龙睡衣，门卫根据衣服认错人。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "key",
        "id": "access",
        "label": "进入方式 · 有钥匙",
        "statement": "母亲有我的家门钥匙。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "care",
        "id": "motive",
        "label": "保持安静 · 怕打扰",
        "statement": "她怕打扰我睡觉或开会，所以不敲门。",
        "level": 1,
        "verdict": "YES"
      }
    ],
    "rubric": [
      {
        "id": "identity",
        "label": "取快递的是母亲",
        "weight": 45
      },
      {
        "id": "mistake",
        "label": "相似外形与同一睡衣导致误认",
        "weight": 30
      },
      {
        "id": "motive",
        "label": "有钥匙，安静送来是为了避免打扰",
        "weight": 25
      }
    ],
    "facts": [],
    "sourceLabel": "题库原文 · 海龟汤题库.docx",
    "sourceUrl": "https://www.zhihu.com/question/507265464/answer/2071696703707674121"
  },
  {
    "id": "mung-soup",
    "mode": "knowledge",
    "number": "K-01",
    "title": "变色的绿豆汤",
    "difficulty": "入门 · 约 5 分钟",
    "hook": "同样的绿豆，为什么一锅汤是绿色，另一锅却偏红？",
    "subtitle": "锅里的颜色，还藏着环境留下的线索。",
    "surface": "为什么绿豆汤有时是红色，有时是绿色？",
    "truth": "绿豆皮中的多酚类物质接触空气和碱性水质后容易被氧化，颜色从绿变红。用铁锅、加碱、开盖煮都容易变红。用纯净水、不锈钢锅、盖盖煮，更容易保持绿色。",
    "twist": "颜色差异可以来自多酚的化学变化，并不意味着换了一种豆。",
    "unknown": "没有给出确切pH、温度曲线和营养含量；不能推出颜色与健康效益的高低。",
    "hints": [
      {
        "keyword": "空气",
        "guidance": "观察开盖与盖盖改变了什么接触条件。"
      },
      {
        "keyword": "水质",
        "guidance": "相同食材之外，比较两锅所用的水。"
      },
      {
        "keyword": "豆皮成分",
        "guidance": "颜色也可能来自食材内部物质的变化。"
      }
    ],
    "clues": [
      {
        "key": "air",
        "id": "air",
        "label": "接触条件 · 空气",
        "statement": "与空气接触会影响汤色。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "oxidation",
        "id": "reaction",
        "label": "变化机制 · 氧化",
        "statement": "多酚类物质氧化会使汤变色。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "alkaline",
        "id": "water",
        "label": "水质 · 偏碱",
        "statement": "偏碱的水会促进变色。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "polyphenols",
        "id": "ingredient",
        "label": "物质 · 多酚",
        "statement": "变色与多酚类物质有关。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "pot",
        "id": "pot",
        "label": "容器 · 锅的材质",
        "statement": "按题库原文，用铁锅容易变红，用不锈钢锅更容易保持绿色。",
        "level": 1,
        "verdict": "YES"
      }
    ],
    "rubric": [
      {
        "id": "reaction",
        "label": "多酚等物质发生氧化导致变色",
        "weight": 50
      },
      {
        "id": "conditions",
        "label": "铁锅、加碱、开盖等因素影响变色",
        "weight": 35
      },
      {
        "id": "control",
        "label": "纯净水、不锈钢锅、盖盖煮更容易保持绿色",
        "weight": 15
      }
    ],
    "facts": [],
    "sourceLabel": "题库原文 · 海龟汤题库.docx",
    "sourceUrl": "https://www.zhihu.com/question/356613340",
    "judgeNotes": "以题库原文作为本局判题依据。题目没有两个人、两锅对照实验设定，不得补出该场景。原文明确提到铁锅、不锈钢锅、空气、水质等因素。询问这些因素是否影响颜色可以按原文确认；精确pH或某一次实际使用的锅未设定。"
  },
  {
    "id": "bear-child",
    "mode": "story",
    "number": "S-02",
    "title": "熊孩子",
    "difficulty": "轻松 · 文字反转",
    "hook": "小熊问了一整天，妈妈口中的“幸福”究竟是什么？",
    "subtitle": "同一个问题，换一个人的视角。",
    "surface": "一天，小熊问熊妈妈：妈妈，妈妈，什么是幸福啊？ 熊妈妈说：孩子，你到森林里去问一圈就知道了。 于是小熊就自己走到森林里，到处问他们什么是幸福啊。 可是小兔子小狐狸小猴子小老虎小狮子都说不知道。 但是小熊仍然不放弃，他在森林里转了一圈又一圈,可是仍然不知道什么是幸福。 傍晚，小熊又累又饿，他决定回家。 回到家后，他发现家里摆满了又香又好吃的饭菜。小熊很感动，可是他还是想知道什么是幸福，他就问妈妈。 熊妈妈慈爱的摸了摸她的头，说：最大的幸福是……",
    "truth": "最大的幸福就是熊孩子一天不在家。",
    "twist": "幸福的体验者从小熊变成妈妈；熊孩子也有调皮孩子的双关。",
    "unknown": "其他动物的经历、家庭成员、母亲职业均未设定。",
    "hints": [
      {
        "keyword": "谁的幸福",
        "guidance": "留意最后回答问题的人。"
      },
      {
        "keyword": "熊",
        "guidance": "这个字放在不同语境里，含义是否相同？"
      },
      {
        "keyword": "不在家",
        "guidance": "比较小熊出门前后，家里有什么不同。"
      }
    ],
    "clues": [
      {
        "key": "mother-view",
        "id": "perspective",
        "label": "视角 · 妈妈",
        "statement": "最后的幸福说的是妈妈自己的感受。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "quiet",
        "id": "quiet",
        "label": "感受 · 清静",
        "statement": "孩子一天不在家让妈妈清静。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "pun",
        "id": "wordplay",
        "label": "用词 · 熊孩子",
        "statement": "熊孩子兼有调皮孩子的双关。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "not-dinner",
        "id": "exclusion",
        "label": "排除 · 饭菜就是答案",
        "statement": "最大的幸福仅指吃到晚餐。",
        "level": 1,
        "verdict": "NO"
      }
    ],
    "rubric": [
      {
        "id": "perspective",
        "label": "幸福指妈妈自己的感受",
        "weight": 35
      },
      {
        "id": "quiet",
        "label": "孩子不在家带来清静",
        "weight": 65
      }
    ],
    "facts": [],
    "sourceLabel": "题库原文 · 海龟汤题库.docx",
    "sourceUrl": "https://www.zhihu.com/question/23733875/answer/75821070"
  },
  {
    "id": "origin",
    "mode": "story",
    "number": "S-03",
    "title": "原产地",
    "difficulty": "进阶 · 超自然设定",
    "hook": "尝一滴血就能指路，为什么五年后我却崩溃了？",
    "subtitle": "【推荐】一个一直被误解的能力。虚构故事，涉及灾难。",
    "surface": "非典之后，我拥有一项特殊能力：吃到任何食物，就能精准知晓它的原产地。一开始，我凭借这个能力成为了一个打假博主，因为我能吃出号称澳洲来的苹果其实是来自海南，号称活鸭现宰的烤鸭其实是千里外送来的冷冻鸭。后来，我又发现这个超能力可以作用在人身上。无数寻亲无果的失孤者慕名来找我，我只要尝一点点他们的血，就能帮他们找到亲人所在的地方。大部分人都能成功找到亲人，但也有少部分人失败了，不过他们也去了我给他们指引的地方安家立业了。\n可诡异的事情接连发生：越来越多求助者全部指向同一个A市。五年后，当我意识到发生了什么的时候，我崩溃了",
    "truth": "我的超能力其实是知道人/动物/植物死亡的地点（植物的原产地就是它被摘下、死亡的地方）。而我在2008年把许多人无意间送去了汶川。",
    "twist": "所谓原产地其实是死亡地点，能力指向提供血液的人，不是他们的亲人。",
    "unknown": "这是虚构设定。植物被采摘等于死亡只是原故事中的解释，不作为生物学事实。未设定每位寻亲者的命运，不可推断所有人死亡；也不能把汶川称为地级市。",
    "hints": [
      {
        "keyword": "时间跨度",
        "guidance": "把时间线索连起来看。"
      },
      {
        "keyword": "超能力含义",
        "guidance": "区分实际观察到的现象，和主人公给它的解释。"
      },
      {
        "keyword": "地点",
        "guidance": "这个地点对谁、在什么时候有意义？"
      },
      {
        "keyword": "灾害",
        "guidance": "把时间与地点联系起来，想想可能对应哪类事件。"
      },
      {
        "keyword": "死亡",
        "guidance": "重新考虑能力指向的地点与生命经历之间的关系。"
      }
    ],
    "clues": [
      {
        "key": "time",
        "id": "time",
        "label": "时间 · 2008年",
        "statement": "五年后指的是2008年。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "self",
        "id": "subject",
        "label": "对象 · 提供血的人",
        "statement": "能力指向提供血液的人。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "death",
        "id": "ability",
        "label": "能力 · 死亡地点",
        "statement": "能力揭示的是死亡地点。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "disaster",
        "id": "disaster",
        "label": "事件 · 地震",
        "statement": "指引的地区后来发生地震。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "wenchuan",
        "id": "place",
        "label": "地点 · 汶川地区",
        "statement": "重要地点是汶川地区。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "not-birth",
        "id": "exclusion",
        "label": "排除 · 出生地",
        "statement": "能力识别的是人的出生地。",
        "level": 1,
        "verdict": "NO"
      }
    ],
    "rubric": [
      {
        "id": "ability",
        "label": "真实能力是感知死亡地点",
        "weight": 50
      },
      {
        "id": "subject",
        "label": "对象是提供血液者，而非亲人",
        "weight": 20
      },
      {
        "id": "event",
        "label": "误解导致指引与2008年汶川地震相连",
        "weight": 30
      }
    ],
    "facts": [],
    "sourceLabel": "题库原文 · 海龟汤题库.docx",
    "sourceUrl": "https://zhuanlan.zhihu.com/p/677348729"
  },
  {
    "id": "takeaway",
    "mode": "story",
    "number": "S-04",
    "title": "外卖",
    "difficulty": "轻松 · 文字反转",
    "hook": "儿子答应“叫外卖”，爸爸为什么带他去了派出所？",
    "subtitle": "一句话，藏着两种理解。",
    "surface": "父亲试探地问儿子：“儿子，你要不要叫外卖？”\n儿子回答：“好！”\n爸爸迟疑了一会儿，最终还是把儿子带去了派出所。",
    "truth": "去派出所改名。",
    "twist": "叫既可指订餐，也可指名字叫作。",
    "unknown": "没有犯罪、失踪或食物中毒设定。改名是否被现实登记机构接受未设定。",
    "hints": [
      {
        "keyword": "“叫”",
        "guidance": "这个字在句子里有哪些用法？"
      },
      {
        "keyword": "派出所",
        "guidance": "这个地点是否只处理报案？"
      },
      {
        "keyword": "名字",
        "guidance": "试着从称呼的角度，重新理解人物的对话。"
      }
    ],
    "clues": [
      {
        "key": "name",
        "id": "name",
        "label": "含义 · 名字",
        "statement": "叫外卖指名字叫作外卖。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "rename",
        "id": "purpose",
        "label": "目的 · 改名",
        "statement": "去派出所是办理改名。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "not-food",
        "id": "exclusion",
        "label": "排除 · 订餐",
        "statement": "父亲的最终行动是在订餐。",
        "level": 1,
        "verdict": "NO"
      },
      {
        "key": "not-crime",
        "id": "crime",
        "label": "排除 · 犯罪报案",
        "statement": "去派出所是因为儿子犯罪。",
        "level": 1,
        "verdict": "NO"
      }
    ],
    "rubric": [
      {
        "id": "pun",
        "label": "识别叫外卖的名字双关",
        "weight": 60
      },
      {
        "id": "purpose",
        "label": "去派出所改名",
        "weight": 40
      }
    ],
    "facts": [],
    "sourceLabel": "题库原文 · 海龟汤题库.docx",
    "sourceUrl": "https://www.zhihu.com/question/23733875/answer/72105298"
  },
  {
    "id": "silent-game",
    "mode": "story",
    "number": "S-05",
    "title": "谁发出声音谁是小猪",
    "difficulty": "进阶 · 悬疑故事",
    "hook": "十七年前的“不出声游戏”，为什么在新公司继续了？",
    "subtitle": "【推荐】两段经历中的同一种危险。虚构悬疑，涉及拐卖。",
    "surface": "七岁那年，姐姐说：我们玩个游戏，谁发出声音谁是小猪。姐姐没出声，也没了踪影。这个游戏我一个人玩了十七年。今年毕业，几百份简历石沉大海，只有一家公司要我，不要求我开口。入职第二周，人事替我申请了免费体检，顺口问了我出生的时辰。",
    "truth": "那不是游戏。七岁那天有人进了屋，姐姐把我塞进藏身处，用一句孩子听得懂的话让我别出声，然后自己被带走了。\n我守了十七年。所有人都当我是哑巴，我自己也快信了——直到几百份简历石沉大海，只剩一家公司要我，因为这份活不需要我开口。\n那家公司做的正是当年那门生意——人口拐卖。不开口、无亲无友、不会向外求援的人，是它挑人的标准，而我十七年前就在名单上：那一晚他们带走了姐姐，我这个没出声的还留着。人事套走精确到几点几分的出生时辰，说是定制生肖礼品；体检抽了血、拍了片，说是新人关怀。那是配型和验货。\n团建订在深山，三天两夜，睡前一杯助眠花茶。我半夜惊醒，躲进后院的木材堆。有人在外面喊：药劲儿都上来了吧，后山和小路都有人守着。\n十七年前那个游戏，现在才玩到终点。",
    "twist": "童年的游戏是保护性指令，公司的关怀是犯罪伪装。",
    "unknown": "未确定新公司与童年闯入者是否为同一批具体人员。精确出生时辰不是器官配型的医学依据，只是套取资料的细节。沉默原因是故事设定，不作医学诊断。",
    "hints": [
      {
        "keyword": "游戏规则",
        "guidance": "一句规则也可能承担别的用途。"
      },
      {
        "keyword": "录用条件",
        "guidance": "关注公司为什么接受主人公的特殊状况。"
      },
      {
        "keyword": "免费体检",
        "guidance": "比较表面理由与实际用途。"
      },
      {
        "keyword": "犯罪",
        "guidance": "区分表面上的活动与它可能掩盖的目的。"
      }
    ],
    "clues": [
      {
        "key": "protect",
        "id": "childhood",
        "label": "童年 · 藏匿保护",
        "statement": "姐姐让主人公安静是为了藏匿保护。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "abduction",
        "id": "sister",
        "label": "姐姐 · 被带走",
        "statement": "姐姐当年遭到绑架或拐卖。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "company",
        "id": "company",
        "label": "公司 · 犯罪伪装",
        "statement": "公司是拐卖团伙的伪装。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "selection",
        "id": "selection",
        "label": "筛选 · 不易求援",
        "statement": "公司挑选难以求援的人。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "exam",
        "id": "exam",
        "label": "体检 · 筛选配型",
        "statement": "体检的目的包含筛选和配型。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "not-game",
        "id": "exclusion",
        "label": "排除 · 普通游戏",
        "statement": "童年那天只是普通游戏。",
        "level": 1,
        "verdict": "NO"
      }
    ],
    "rubric": [
      {
        "id": "childhood",
        "label": "姐姐用游戏指令保护藏起来的主人公",
        "weight": 35
      },
      {
        "id": "company",
        "label": "公司是拐卖团伙伪装",
        "weight": 40
      },
      {
        "id": "selection",
        "label": "录用和体检服务于筛选控制",
        "weight": 25
      }
    ],
    "facts": [],
    "sourceLabel": "题库原文 · 海龟汤题库.docx",
    "sourceUrl": "https://www.zhihu.com/question/31564526/answer/2077391030635197130"
  },
  {
    "id": "holland",
    "mode": "knowledge",
    "number": "K-02",
    "title": "荷兰与尼德兰",
    "difficulty": "入门 · 名称与历史",
    "hook": "Holland 与 Netherlands，为什么会被用来指同一个国家？",
    "subtitle": "一个地方的名字，怎样代表了更大的范围？",
    "surface": "为什么“Netherlands”会被翻译成“荷兰” ？",
    "truth": "历史上荷兰省（Holland）是该国最发达省份，来华商人都来自此地，中国人便以省名代指全国。",
    "twist": "常用别称来自影响较大的局部地区，并非两个国家。",
    "unknown": "题库未提供中文译名的精确首次记载，不补充原文之外的历史细节。",
    "hints": [
      {
        "keyword": "地图范围",
        "guidance": "比较两个名称覆盖的地域。"
      },
      {
        "keyword": "历史影响",
        "guidance": "为什么某个地区会更为外界熟悉？"
      },
      {
        "keyword": "代称",
        "guidance": "局部名称是否可能被用来指整体？"
      }
    ],
    "clues": [
      {
        "key": "region",
        "id": "region",
        "label": "范围 · 地区与国家",
        "statement": "Holland是地区，Netherlands是整个国家。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "influence",
        "id": "influence",
        "label": "原因 · 地区影响",
        "statement": "按题库原文，Holland是当时最发达省份，来华商人都来自此地，中国人以省名代指全国。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "synecdoche",
        "id": "usage",
        "label": "用法 · 局部代整体",
        "statement": "Holland被用来代指整个国家。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "not-two",
        "id": "exclusion",
        "label": "排除 · 两个国家",
        "statement": "两个名称指两个不同国家。",
        "level": 1,
        "verdict": "NO"
      }
    ],
    "rubric": [
      {
        "id": "scope",
        "label": "区分地区与整个国家",
        "weight": 55
      },
      {
        "id": "history",
        "label": "按题库解释，发达省份及来华商人促成以省名代全国",
        "weight": 45
      }
    ],
    "facts": [],
    "sourceLabel": "题库原文 · 海龟汤题库.docx",
    "sourceUrl": "https://www.zhihu.com/question/661323355/answer/3568100162"
  },
  {
    "id": "scapegoat",
    "mode": "knowledge",
    "number": "K-03",
    "title": "替罪羊",
    "difficulty": "入门 · 词语典故",
    "hook": "为什么替别人承担过错的偏偏是“羊”？",
    "subtitle": "一个日常说法背后的古老仪式。",
    "surface": "明明可以是替罪牛、替罪鸡，为什么叫“替罪羊”？",
    "truth": "主要来自《圣经·利未记》赎罪日仪式。祭司把双手按在羊头上，象征把民众罪过转移到羊身上，然后把羊放到旷野归给阿撒泻勒。后来“替罪羊”指无辜承担他人罪责的人。",
    "twist": "羊不是因为真的有罪，而是被仪式象征性地赋予了罪责。",
    "unknown": "阿撒泻勒的具体解释存在不同传统，本题不据此判定唯一解释。不把仪式描述当作现实超自然效果。",
    "hints": [
      {
        "keyword": "典故",
        "guidance": "这个表达可能先有一个具体故事。"
      },
      {
        "keyword": "承担",
        "guidance": "区分真正犯错与被赋予责任。"
      },
      {
        "keyword": "仪式",
        "guidance": "某种动物是否有象征性的作用？"
      }
    ],
    "clues": [
      {
        "key": "bible",
        "id": "source",
        "label": "出处 · 利未记",
        "statement": "典故与圣经利未记有关。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "ritual",
        "id": "ritual",
        "label": "场景 · 赎罪仪式",
        "statement": "羊用于赎罪仪式。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "symbol",
        "id": "symbol",
        "label": "作用 · 象征承担罪过",
        "statement": "羊被象征性地赋予群体的罪过。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "wilderness",
        "id": "action",
        "label": "行动 · 送入旷野",
        "statement": "承担罪过的活羊被送入旷野。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "not-guilty",
        "id": "exclusion",
        "label": "排除 · 羊真的犯罪",
        "statement": "羊被选中是因为它实际犯罪。",
        "level": 1,
        "verdict": "NO"
      }
    ],
    "rubric": [
      {
        "id": "origin",
        "label": "说明赎罪仪式的典故",
        "weight": 40
      },
      {
        "id": "symbol",
        "label": "羊象征承担并带走他人的罪过",
        "weight": 60
      }
    ],
    "facts": [],
    "sourceLabel": "题库原文 · 海龟汤题库.docx",
    "sourceUrl": "https://www.zhihu.com/question/561377532"
  },
  {
    "id": "meat-juice",
    "mode": "knowledge",
    "number": "K-04",
    "title": "肉汁与焯水",
    "difficulty": "入门 · 烹饪观察",
    "hook": "为什么炖肉要去血水，烤肉却不用？",
    "subtitle": "比较炖煮与烤制。",
    "surface": "为什么炖肉要去血水，烤肉却不用？",
    "truth": "炖煮时血水中的腥味物质会溶解到汤汁里，被肉重新吸收。烤制时高温让血水迅速凝固、滴落或焦化，腥味不容易残留。所以炖肉需要提前焯水去血水，烤肉不必。",
    "twist": "题库解释炖煮与烤制时血水和腥味物质处理方式的不同。",
    "unknown": "没有给出肉种、切块大小、温度和时间，不判断是否已经安全熟制，也不提供固定烹调时间。",
    "hints": [
      {
        "keyword": "炖煮",
        "guidance": "关注题目中的炖煮方式。"
      },
      {
        "keyword": "烤制",
        "guidance": "比较另一种加热方式。"
      },
      {
        "keyword": "血水",
        "guidance": "围绕题目提到的处理对象提问。"
      }
    ],
    "clues": [
      {
        "key": "stew",
        "id": "stew",
        "label": "炖煮 · 溶解与吸收",
        "statement": "题库指出炖煮时血水中的腥味物质溶解到汤汁里，被肉重新吸收。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "roast",
        "id": "roast",
        "label": "烤制 · 高温处理",
        "statement": "题库指出烤制高温让血水迅速凝固、滴落或焦化，腥味不易残留。",
        "level": 1,
        "verdict": "YES"
      },
      {
        "key": "blanch",
        "id": "blanch",
        "label": "处理 · 提前焯水",
        "statement": "按题库答案，炖肉需要提前焯水去血水，烤肉不必。",
        "level": 1,
        "verdict": "YES"
      }
    ],
    "rubric": [
      {
        "id": "stew",
        "label": "解释炖煮中腥味物质溶入汤汁并被重新吸收",
        "weight": 40
      },
      {
        "id": "roast",
        "label": "解释烤制高温让血水凝固、滴落或焦化",
        "weight": 40
      },
      {
        "id": "treatment",
        "label": "得出题库中的焯水处理差异",
        "weight": 20
      }
    ],
    "facts": [],
    "sourceLabel": "题库原文 · 海龟汤题库.docx",
    "sourceUrl": "https://www.zhihu.com/question/518358415"
  }
];
export function publicCase(item) {
  const {id,mode,number,title,difficulty,hook,subtitle,surface,hints,sourceLabel,sourceUrl} = item;
  return {id,mode,number,title,difficulty,hook,subtitle,surface,hints,sourceLabel,sourceUrl};
}
