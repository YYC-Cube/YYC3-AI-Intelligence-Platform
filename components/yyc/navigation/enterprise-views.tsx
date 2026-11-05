/**
 * @fileoverview YYC3 · 企业后台模块视图
 * @description 每个一级模块使用不同的信息架构（指标 / 漏斗 / 卡片 / 表单 / 时间线等），
 *              避免所有页面共用同一套占位内容。所有数据为演示数据。
 */
import { ArrowDownRight, ArrowUpRight, Check, Clock, Server, ShieldCheck, Zap } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

type ViewProps = {
  l1Label: string;
  l2Label: string;
  l3Label: string;
};

function Panel({
  title,
  extra,
  children,
}: {
  title: string;
  extra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        {extra}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Kpi({
  label,
  value,
  delta,
  positive = true,
  suffix,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
        {value}
        {suffix && <span className="ml-1 text-sm font-normal text-slate-400">{suffix}</span>}
      </p>
      <p
        className={`mt-1 flex items-center gap-1 text-xs ${positive ? 'text-emerald-600' : 'text-rose-600'}`}
      >
        {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {delta}
      </p>
    </div>
  );
}

function BarChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t bg-gradient-to-t from-blue-500 to-cyan-400"
            style={{ height: `${Math.round((d.value / max) * 100)}%` }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-[10px] text-slate-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DemoTag() {
  return (
    <span className="px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-medium">
      演示数据
    </span>
  );
}

/** 数据中心：指标看板 + 趋势 + 明细表 */
export function DataCenterView({ l2Label, l3Label }: ViewProps) {
  const trend = [
    { label: '1月', value: 42 },
    { label: '2月', value: 51 },
    { label: '3月', value: 47 },
    { label: '4月', value: 63 },
    { label: '5月', value: 58 },
    { label: '6月', value: 71 },
    { label: '7月', value: 66 },
    { label: '8月', value: 78 },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="日活用户" value="12,480" delta="+8.2%" />
        <Kpi label="数据接入量" value="3.6" suffix="GB/日" delta="+3.1%" />
        <Kpi label="查询响应" value="86" suffix="ms" delta="-12ms" />
        <Kpi label="异常告警" value="4" delta="+1" positive={false} />
      </div>
      <Panel title={`${l2Label} · ${l3Label}趋势`} extra={<DemoTag />}>
        <BarChart data={trend} />
      </Panel>
      <Panel title="指标明细">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="pb-2 font-medium">指标</th>
              <th className="pb-2 font-medium">今日</th>
              <th className="pb-2 font-medium">周环比</th>
              <th className="pb-2 font-medium">状态</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['新增会话', '2,140', '+6.4%', '正常'],
              ['数据延迟', '1.8s', '-0.3s', '正常'],
              ['同步失败', '12', '+4', '需关注'],
              ['存储水位', '68%', '+2%', '正常'],
            ].map((row) => (
              <tr key={row[0]} className="border-b border-slate-50 dark:border-slate-800/50">
                <td className="py-2.5 text-slate-700 dark:text-slate-300">{row[0]}</td>
                <td className="py-2.5 text-slate-900 dark:text-white">{row[1]}</td>
                <td className="py-2.5 text-slate-500">{row[2]}</td>
                <td className="py-2.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${row[3] === '正常' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}
                  >
                    {row[3]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/** 核心业务：转化漏斗 + 客户/订单双栏 */
export function CoreBusinessView({ l2Label }: ViewProps) {
  const funnel = [
    { stage: '线索', count: 1280, width: 100 },
    { stage: '商机', count: 640, width: 78 },
    { stage: '报价', count: 320, width: 56 },
    { stage: '合同', count: 168, width: 38 },
    { stage: '回款', count: 120, width: 26 },
  ];
  return (
    <div className="space-y-5">
      <Panel title={`${l2Label} · 业务转化漏斗`} extra={<DemoTag />}>
        <div className="space-y-3">
          {funnel.map((f) => (
            <div key={f.stage} className="flex items-center gap-3">
              <span className="w-12 text-xs text-slate-500">{f.stage}</span>
              <div className="flex-1 h-7 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded bg-gradient-to-r from-emerald-500 to-teal-400 text-[11px] text-white flex items-center px-2"
                  style={{ width: `${f.width}%` }}
                >
                  {f.count}
                </div>
              </div>
              <span className="w-12 text-right text-xs text-slate-400">
                {Math.round((f.count / funnel[0].count) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </Panel>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="重点客户">
          {['远海科技', '星野数据', '云栖智能'].map((c, i) => (
            <div
              key={c}
              className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-800/50 last:border-0"
            >
              <div>
                <p className="text-sm text-slate-800 dark:text-slate-200">{c}</p>
                <p className="text-[11px] text-slate-400">跟进人 · 张{['一', '二', '三'][i]}</p>
              </div>
              <span className="text-xs text-emerald-600">¥{[86, 52, 43][i]}万</span>
            </div>
          ))}
        </Panel>
        <Panel title="待处理订单">
          {[
            ['SO-2041', '待发货', '2h'],
            ['SO-2038', '待开票', '5h'],
            ['SO-2036', '待回款', '1d'],
          ].map((o) => (
            <div
              key={o[0]}
              className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-800/50 last:border-0"
            >
              <span className="font-mono text-xs text-slate-600 dark:text-slate-300">{o[0]}</span>
              <span className="text-xs text-amber-600">{o[1]}</span>
              <span className="text-[11px] text-slate-400">{o[2]}</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

/** 人力资源：部门卡片 + 人员构成 + 招聘看板 */
export function HrView({ l2Label }: ViewProps) {
  const depts = [
    { name: '技术中心', head: 86, ratio: 42 },
    { name: '产品设计', head: 34, ratio: 26 },
    { name: '业务运营', head: 52, ratio: 32 },
  ];
  const stages = [
    { name: '简历筛选', count: 128 },
    { name: '初试', count: 46 },
    { name: '复试', count: 21 },
    { name: 'Offer', count: 8 },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {depts.map((d) => (
          <div
            key={d.name}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
          >
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{d.name}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{d.head}</p>
            <div className="mt-3 h-1.5 rounded bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded bg-indigo-500" style={{ width: `${d.ratio}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">占比 {d.ratio}%</p>
          </div>
        ))}
      </div>
      <Panel title={`${l2Label} · 招聘流程`} extra={<DemoTag />}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stages.map((s) => (
            <div key={s.name} className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
              <p className="text-xs text-slate-500">{s.name}</p>
              <p className="text-xl font-semibold text-slate-900 dark:text-white">{s.count}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/** 财务资产：收支总览 + 预算执行 + 费用明细 */
export function FinanceView({ l2Label }: ViewProps) {
  const budgets = [
    { name: '市场投放', used: 72 },
    { name: '研发投入', used: 58 },
    { name: '行政支出', used: 41 },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          ['本期收入', '¥ 862.4 万', 'text-emerald-600'],
          ['本期成本', '¥ 415.7 万', 'text-rose-600'],
          ['净利润', '¥ 446.7 万', 'text-blue-600'],
        ].map(([label, value, color]) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
          >
            <p className="text-xs text-slate-500">{label}</p>
            <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
      <Panel title={`${l2Label} · 预算执行`} extra={<DemoTag />}>
        <div className="space-y-4">
          {budgets.map((b) => (
            <div key={b.name}>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{b.name}</span>
                <span>{b.used}%</span>
              </div>
              <div className="h-2 rounded bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded ${b.used > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${b.used}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/** 办公协同：待办 + 审批时间线 + 会议 */
export function OfficeView({ l2Label }: ViewProps) {
  const todos = [
    { title: '审批《2026 年度预算》', tag: '高', done: false },
    { title: '确认供应商合同条款', tag: '中', done: false },
    { title: '归档季度经营分析会纪要', tag: '低', done: true },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title={`${l2Label} · 待办`} extra={<DemoTag />}>
          <ul className="space-y-2">
            {todos.map((t) => (
              <li
                key={t.title}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800"
              >
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${t.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}
                >
                  {t.done && <Check className="w-3 h-3" />}
                </span>
                <span
                  className={`flex-1 text-sm ${t.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}
                >
                  {t.title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] ${t.tag === '高' ? 'bg-rose-50 text-rose-600' : t.tag === '中' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}
                >
                  {t.tag}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="审批动态">
          <ol className="relative border-l border-slate-200 dark:border-slate-700 pl-4 space-y-4">
            {[
              ['提交', '李四 · 09:12'],
              ['部门审批', '王五 · 09:40'],
              ['财务复核', '待处理'],
            ].map(([step, meta], i) => (
              <li key={step} className="relative">
                <span
                  className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${i === 2 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                />
                <p className="text-sm text-slate-800 dark:text-slate-200">{step}</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {meta}
                </p>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
      <Panel title="今日会议">
        {[
          ['10:00', '产品周会', '会议室 A'],
          ['14:00', '客户方案评审', '线上'],
        ].map((m) => (
          <div key={m[0]} className="flex items-center gap-4 py-2 text-sm">
            <span className="font-mono text-xs text-blue-600">{m[0]}</span>
            <span className="text-slate-800 dark:text-slate-200">{m[1]}</span>
            <span className="text-xs text-slate-400">{m[2]}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

/** AI 智能：模型卡片 + 用量 + 提示词模板 */
export function AiCenterView({ l2Label }: ViewProps) {
  const models = [
    { name: 'YYC3 · 决策模型', calls: '18.2K', latency: '42ms', status: 'online' },
    { name: 'YYC3 · 语义检索', calls: '9.4K', latency: '68ms', status: 'online' },
    { name: 'YYC3 · 内容生成', calls: '3.1K', latency: '210ms', status: 'degraded' },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {models.map((m) => (
          <div
            key={m.name}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{m.name}</p>
              <span
                className={`w-2 h-2 rounded-full ${m.status === 'online' ? 'bg-emerald-500' : 'bg-amber-400'}`}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded bg-slate-50 dark:bg-slate-800/50 p-2">
                <p className="text-slate-400">调用量</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium">{m.calls}</p>
              </div>
              <div className="rounded bg-slate-50 dark:bg-slate-800/50 p-2">
                <p className="text-slate-400">P95 延迟</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium">{m.latency}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Panel title={`${l2Label} · Token 用量`} extra={<DemoTag />}>
        <div className="space-y-3">
          {[
            ['本月已用', 68],
            ['日均配额', 42],
            ['缓存命中率', 81],
          ].map(([label, pct]) => (
            <div key={String(label)}>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{label}</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 rounded bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded bg-violet-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="提示词模板">
        {['竞品拆解 · ASO', '差评归因 · 评论', '增长假设生成'].map((p) => (
          <div
            key={p}
            className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800/50 last:border-0"
          >
            <span className="text-sm text-slate-700 dark:text-slate-300">{p}</span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> 已启用
            </span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

/** 系统设置：开关组 + 集成状态 + 审计日志 */
export function SettingsView({ l2Label }: ViewProps) {
  const switches = [
    ['双因子认证', true],
    ['登录异常告警', true],
    ['自动备份', true],
    ['外部 API 访问', false],
  ] as const;
  return (
    <div className="space-y-5">
      <Panel title={`${l2Label} · 安全与策略`} extra={<DemoTag />}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {switches.map(([name, on]) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 px-4 py-3"
            >
              <span className="text-sm text-slate-700 dark:text-slate-300">{name}</span>
              <span
                className={`relative w-10 h-5 rounded-full transition-colors ${on ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${on ? 'left-5' : 'left-0.5'}`}
                />
              </span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="集成状态">
        <table className="w-full text-sm">
          <tbody>
            {[
              ['App Store Connect', '已连接', '32 分钟前同步'],
              ['Google Play Console', '已连接', '1 小时前同步'],
              ['企业 SSO', '未配置', '—'],
            ].map(([name, state, meta]) => (
              <tr
                key={name}
                className="border-b border-slate-50 dark:border-slate-800/50 last:border-0"
              >
                <td className="py-2.5 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-slate-400" />
                  {name}
                </td>
                <td className="py-2.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${state === '已连接' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {state}
                  </span>
                </td>
                <td className="py-2.5 text-xs text-slate-400">{meta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      <Panel
        title="审计日志"
        extra={
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> 仅保留 90 天
          </span>
        }
      >
        {[
          ['09:42', 'admin 修改了角色权限'],
          ['09:18', 'finance 导出了费用报表'],
          ['08:55', 'system 完成自动备份'],
        ].map(([time, action]) => (
          <div key={time} className="flex gap-3 py-2 text-xs">
            <span className="font-mono text-slate-400">{time}</span>
            <span className="text-slate-600 dark:text-slate-300">{action}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

const VIEWS: Record<string, (props: ViewProps) => ReactElement> = {
  'data-center': DataCenterView,
  'core-business': CoreBusinessView,
  hr: HrView,
  finance: FinanceView,
  office: OfficeView,
  'ai-center': AiCenterView,
  settings: SettingsView,
};

export function EnterpriseModuleView(props: ViewProps & { l1Id: string }) {
  const View = VIEWS[props.l1Id] ?? DataCenterView;
  return <View {...props} />;
}
