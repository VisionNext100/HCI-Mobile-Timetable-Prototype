# 查找佐证性科学文献

本项目小组共 3 名成员，因此每位成员各选取 1 篇来自 SIGCHI 或 UIST 会议论文集的文献。三篇文献分别从移动端单手操作、小屏信息压缩、屏外/当前状态感知三个角度支持本项目的移动端课表重设计。

## 文献 1：AppLens and LaunchTile

### 选定论文

Karlson, A. K., Bederson, B. B., & SanGiovanni, J. (2005). *AppLens and LaunchTile: Two designs for one-handed thumb use on small devices*. Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '05), 201-210. ACM. https://doi.org/10.1145/1054972.1055001

### 论文质量与出处

该论文发表在 CHI 2005，即 *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*，属于 SIGCHI 会议论文集。论文由 ACM 出版，主题聚焦小屏移动设备上的单手拇指操作、界面缩放与信息层级组织，研究问题明确，方法包括原型设计和用户研究，能够为移动端课表界面的交互重设计提供直接的人机交互依据。

### 论文摘要概括

Karlson、Bederson 和 SanGiovanni 研究了 PDA 和手机等小屏移动设备上的单手拇指操作问题。作者指出，传统移动界面常常把桌面端控件和信息布局直接压缩到小屏上，导致触控目标过小、导航路径复杂、用户难以在单手持机状态下快速完成任务。为解决这一问题，论文提出了 AppLens 和 LaunchTile 两种界面设计。AppLens 使用 tabular fisheye 方式组织应用入口，使用户在小屏上同时看到整体结构和局部重点；LaunchTile 则使用 zooming interface，让用户通过缩放进入更大的应用空间。作者还设计并评估了两组拇指手势。实验结果显示，方向导航类手势比对象操作类手势更准确、更高效，也更容易被用户掌握；同时，用户更偏好能够在小屏中兼顾概览、局部信息和操作效率的 AppLens 设计。

### 对本项目的适用性

本项目改进对象是华东师范大学移动端官方课表。该界面的主要使用场景与论文研究的小屏移动交互高度相关：学生通常在课间、路上、食堂排队、刚下课或临近上课时查看课表，常见任务是快速确认“下一节课是什么”“在哪里上课”“现在第几节”“当前周是否有这门课”。这些任务具有时间压力强、注意力有限、经常单手持机、需要快速判断等特点。因此，课表界面的问题不仅是视觉美观或信息密度问题，更是移动端小屏交互问题。该论文关于单手拇指操作、方向导航、可扩展信息层级和小屏概览的研究结论，可以直接用于支持本项目的设计原则：降低学生在移动场景下获取当前与下一节课信息的认知负荷和操作步数。

### 对设计决策的影响

首先，该论文影响了本项目的信息层级设计。论文中的 AppLens 通过 tabular fisheye 在小屏中同时提供整体结构和局部重点，说明移动端界面不应简单堆叠所有细节，而应让用户先获得概览，再按需进入更详细的信息。本项目因此将课表主页设计为紧凑整周网格，只展示课程名、地点、日期和节次等最关键的信息；课程代码、教师、上课周数、班级人数和备注则放入课程详情页中。这样做既保留了整周课程分布的整体视图，又避免在手机小屏上一次性显示过多字段，减少阅读和识别负担。

其次，该论文影响了本项目的周次切换和导航方式。论文用户研究显示，方向导航类手势比复杂对象操作更准确、更高效。基于这一点，本项目没有只依赖一个小型下拉菜单切换周次，而是提供了顶部左右按钮、点击周次打开纵向列表、在课表区域左右滑动切换周次三种方式。这些交互都具有清晰的方向映射关系，用户可以用“上一周/下一周”的自然时间顺序完成操作，降低学习成本和误操作概率。

最后，该论文强化了本项目对触控目标和单手使用场景的关注。移动端课表中的课程块被压缩在 7 列网格中，尤其在手机宽度较小时，要求用户精确点击某个课程色块会增加操作负担。为此，本项目加入底部“下一节课”悬浮栏，将学生最常访问的信息做成大面积、靠近拇指操作区域的入口。用户不必在密集课表中寻找并点击小课程块，也能直接看到下一节课名称、时间和地点，并进入详情页。这一设计体现了论文中对拇指可达性、触控目标大小和移动场景快速操作的关注。

## 文献 2：Collapse-to-Zoom

### 选定论文

Baudisch, P., Xie, X., Wang, C., & Ma, W.-Y. (2004). *Collapse-to-zoom: Viewing web pages on small screen devices by interactively removing irrelevant content*. Proceedings of the 17th Annual ACM Symposium on User Interface Software and Technology (UIST '04), 91-94. ACM. https://doi.org/10.1145/1029632.1029647

### 论文质量与出处

该论文发表在 UIST 2004，即 *Proceedings of the 17th Annual ACM Symposium on User Interface Software and Technology*，属于 UIST 会议论文集。论文由 ACM 出版，研究主题是小屏设备上的信息浏览与内容压缩。虽然论文直接研究的是小屏网页浏览，但其核心问题是如何在有限屏幕空间中保留相关内容、移除不相关内容并降低滚动和查找成本，这与移动端课表重设计高度相关。

### 论文摘要概括

Baudisch、Xie、Wang 和 Ma 提出了 collapse-to-zoom 技术，用于帮助用户在 PDA 等小屏设备上浏览原本为桌面屏幕设计的网页。传统小屏浏览方式通常有两个问题：如果保持桌面布局，用户需要大量横向和纵向滚动；如果只提供缩略概览，文字和细节又会变得难以辨认，用户需要反复猜测和放大。Collapse-to-zoom 的思路是让用户交互式地折叠不相关内容，例如菜单栏、广告或归档信息。被折叠的区域变成占位符，剩余内容获得更大的显示空间，从而提高可读性。论文还提出了 marquee menu 作为单笔划交互方式，使用户能够快速执行折叠、展开和阅读视图切换等操作。

### 对本项目的适用性

移动端课表同样面临小屏空间不足的问题。官方课表需要同时呈现课程名称、地点、教师、周次、节次、日期等信息，如果全部放在首页，会导致界面拥挤；如果过度隐藏信息，又会增加用户点击和跳转成本。Collapse-to-zoom 对本项目的启发在于：小屏界面应根据任务优先级区分核心信息和次要信息，把当前任务最需要的信息留在首页，把不立即需要的细节放入更低层级。

对学生来说，打开课表后的高频任务通常是确认下一节课、地点、当前节次和今日进度，而不是一次性阅读所有课程详情。因此，该论文可以支持本项目采用“首页压缩展示关键字段 + 详情页承载完整信息”的策略。

### 对设计决策的影响

该论文直接影响了本项目的信息取舍。课表首页没有展示所有字段，而是优先保留课程名、地点、日期、节次、课程颜色和当前/下一节提示。教师、课程代码、班级人数、备注、具体周数说明等信息则放入详情页中。这与 collapse-to-zoom 的核心思想一致：在小屏场景下移除或折叠当前任务不需要的内容，让剩余的关键信息更容易阅读。

该论文也支持本项目对“紧凑课表网格”的设计。紧凑并不意味着把所有信息无差别压缩，而是减少空白、突出课程分布，并通过颜色和位置帮助用户快速定位。用户需要更详细的信息时，可以点击课程进入详情页。这样，首页承担概览和快速查找任务，详情页承担完整信息说明任务。

此外，论文强调小屏浏览中用户容易陷入“hunt-and-peck”式反复查找。本项目通过今日进度条和底部下一节课悬浮栏，把用户最常寻找的信息直接前置，减少在整周课表中反复搜索的时间。这使设计目标从单纯提高屏幕利用率，进一步转向降低移动场景中的查找成本。

## 文献 3：Halo

### 选定论文

Baudisch, P., & Rosenholtz, R. (2003). *Halo: A technique for visualizing off-screen objects*. Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '03), 481-488. ACM. https://doi.org/10.1145/642611.642695

### 论文质量与出处

该论文发表在 CHI 2003，即 *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*，属于 SIGCHI 会议论文集。论文由 ACM 出版，研究主题是小屏或有限视窗中如何提示屏幕外重要对象的位置，关键词包括 off-screen、peripheral awareness、small screens 和 visualization。该论文与本项目的关系在于：移动端课表同样存在“重要信息不一定正好出现在用户当前视线范围内”的问题，例如下一节课可能在屏幕下方，当前节次位置需要用户滚动查找。

### 论文摘要概括

Baudisch 和 Rosenholtz 提出了 Halo 技术，用于在地图或类似二维空间中提示屏幕外对象的位置。传统方式通常使用箭头或小地图提示屏外目标，但箭头往往只能表达方向，难以准确表达距离；小地图则需要占用额外屏幕空间。Halo 的方法是在屏幕边缘显示部分圆弧，用户可以根据圆弧的弯曲程度和位置推断屏外对象的大致方向和距离。该技术的目标是在不占用大量屏幕空间的情况下，提高用户对屏外重要对象的空间感知能力，减少盲目平移、缩放和搜索。

### 对本项目的适用性

虽然 Halo 研究的对象主要是地图中的屏外位置提示，但它解决的问题与移动端课表相似：在有限屏幕上，用户无法同时看到所有重要内容，却仍然需要知道关键目标在哪里。手机课表通常需要纵向滚动才能看完整天或整周课程，用户在课间快速查看时，可能并不知道当前节次、下一节课或今日剩余课程位于界面的哪个位置。如果完全依赖用户自己滚动查找，就会增加时间成本和认知负荷。

因此，该论文可以支持本项目对“状态感知”和“关键目标提示”的设计。移动端课表不应只被动展示完整网格，还应主动提示当前和下一步最重要的信息，让用户不用反复滚动也能保持对课程状态的感知。

### 对设计决策的影响

该论文影响了本项目对“当前状态可见性”的设计。受 Halo 启发，我们将当前节次行和今日列高亮，使用户在课表网格中能更快定位“现在”所在的位置。即使课表内容较密，用户也能通过视觉提示理解当前课程与整周结构之间的关系。

该论文也支持底部“下一节课”悬浮栏的设计。严格来说，悬浮栏不是 Halo 的圆弧提示形式，但它服务于相同的人机交互目标：当关键目标可能不在当前可见区域内时，通过边缘或固定位置提示把它重新带回用户注意范围。对于学生来说，下一节课是最重要的行动目标，因此将其固定显示在底部，比要求用户在整周网格中寻找更符合移动场景需求。

此外，Halo 强调在有限视窗中保持 peripheral awareness。本项目的今日进度条、当前行/列高亮和下一节悬浮栏共同承担这一作用：它们让用户在不完整浏览全表的情况下，仍能知道今天的课程进展、当前所在时间段和下一步行动。这有助于降低工作记忆负担，也减少因滚动、查找和周次判断造成的错误。

## 参考文献

Karlson, A. K., Bederson, B. B., & SanGiovanni, J. (2005). *AppLens and LaunchTile: Two designs for one-handed thumb use on small devices*. Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '05), 201-210. ACM. https://doi.org/10.1145/1054972.1055001

Baudisch, P., Xie, X., Wang, C., & Ma, W.-Y. (2004). *Collapse-to-zoom: Viewing web pages on small screen devices by interactively removing irrelevant content*. Proceedings of the 17th Annual ACM Symposium on User Interface Software and Technology (UIST '04), 91-94. ACM. https://doi.org/10.1145/1029632.1029647

Baudisch, P., & Rosenholtz, R. (2003). *Halo: A technique for visualizing off-screen objects*. Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '03), 481-488. ACM. https://doi.org/10.1145/642611.642695
