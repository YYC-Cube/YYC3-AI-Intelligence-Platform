import { render, screen } from '@testing-library/react';
import { EnterpriseModuleView } from '../../components/yyc/navigation/enterprise-views';

const base = { l1Label: '模块', l2Label: '子模块', l3Label: '页签' };

describe('企业后台 · 模块信息架构差异化', () => {
  const cases = [
    ['data-center', /日活用户/],
    ['core-business', /业务转化漏斗/],
    ['hr', /招聘流程/],
    ['finance', /本期收入/],
    ['office', /审批动态/],
    ['ai-center', /Token 用量/],
    ['settings', /安全与策略/],
  ] as const;

  it.each(cases)('%s 应渲染独立的结构化内容', (l1Id, marker) => {
    render(<EnterpriseModuleView l1Id={l1Id} {...base} />);
    expect(screen.getByText(marker)).toBeInTheDocument();
  });

  it('未知模块应回退到数据中心视图', () => {
    render(<EnterpriseModuleView l1Id="unknown" {...base} />);
    expect(screen.getByText(/日活用户/)).toBeInTheDocument();
  });

  it('不同模块不得共用同一套内容标记', () => {
    const { container: a } = render(<EnterpriseModuleView l1Id="data-center" {...base} />);
    const { container: b } = render(<EnterpriseModuleView l1Id="finance" {...base} />);
    expect(a.innerHTML).not.toEqual(b.innerHTML);
  });
});
