import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { NARAConsole } from '../../components/NARAConsole';

describe('NARAConsole Component', () => {
  beforeEach(() => {
    render(<NARAConsole />);
  });

  describe('初始渲染', () => {
    it('应该正确渲染标题 "YYC3 · NARA"', () => {
      expect(screen.getByText('YYC3 · NARA')).toBeInTheDocument();
    });

    it('应该正确渲染副标题 "AI 操作系统"（默认中文）', () => {
      expect(screen.getByText('AI 操作系统')).toBeInTheDocument();
    });

    it('应该显示在线状态', () => {
      expect(screen.getByText('在线')).toBeInTheDocument();
    });

    it('默认应该显示主页模式', () => {
      expect(screen.getByText('主页')).toBeInTheDocument();
    });
  });

  describe('模式切换', () => {
    it('应该显示4个模式标签', () => {
      const tabs = screen.getAllByRole('button');
      const tabLabels = tabs.map((tab) => tab.textContent);

      expect(tabLabels).toContain('主页');
      expect(tabLabels).toContain('对话');
      expect(tabLabels).toContain('循环');
      expect(tabLabels).toContain('企业系统');
    });

    it('点击"对话"标签应该切换到ChatMode', () => {
      const chatTab = screen.getByText('对话').closest('button');
      expect(chatTab).not.toBeNull();
      if (chatTab) {
        fireEvent.click(chatTab);
      }

      expect(chatTab).toHaveClass('text-slate-800');
    });

    it('点击"循环"标签应该切换到LoopMode', () => {
      const loopTab = screen.getByText('循环').closest('button');
      expect(loopTab).not.toBeNull();
      if (loopTab) {
        fireEvent.click(loopTab);
      }

      expect(loopTab).toHaveClass('text-slate-800');
    });

    it('点击"企业系统"标签应该切换到System模式', () => {
      const systemTab = screen.getByText('企业系统').closest('button');
      expect(systemTab).not.toBeNull();
      if (systemTab) {
        fireEvent.click(systemTab);
      }

      // System mode replaces the NARA Console with YYCEnterpriseLayout
      // and renders an "Exit" button to return to Console
      expect(screen.getByText('Exit')).toBeInTheDocument();
    });
  });

  describe('语言切换', () => {
    it('应该显示语言切换按钮', () => {
      const langButton = screen.getByText('EN');
      expect(langButton).toBeInTheDocument();
    });

    it('点击语言按钮应该切换到英文', () => {
      const langButton = screen.getByText('EN');
      fireEvent.click(langButton);

      expect(screen.getByText('AI Operating System')).toBeInTheDocument();
      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('切换到英文后再点击应该切回中文', () => {
      const langButton = screen.getByText('EN');
      fireEvent.click(langButton);

      const zhButton = screen.getByText('中文');
      fireEvent.click(zhButton);

      expect(screen.getByText('AI 操作系统')).toBeInTheDocument();
    });
  });

  describe('状态指示器', () => {
    it('应该显示绿色的在线状态指示器', () => {
      const statusIndicator = screen.getByText('在线').closest('div');
      expect(statusIndicator).toHaveClass('bg-emerald-50');
    });
  });
});

describe('NARAConsole 边界情况', () => {
  it('不应该有任何控制台错误', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<NARAConsole />);

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
