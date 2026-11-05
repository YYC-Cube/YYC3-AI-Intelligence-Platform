import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginFlow } from '../../components/LoginFlow';

describe('LoginFlow 引导流程', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('未填写链接时分析按钮应为禁用态', () => {
    render(<LoginFlow onComplete={jest.fn()} />);

    expect(screen.getByRole('button', { name: /Analyze My App/i })).toBeDisabled();
  });

  it('非法链接应提示错误且停留在第一步', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<LoginFlow onComplete={jest.fn()} />);

    await user.type(screen.getByLabelText(/App Store URL/i), 'abc');
    await user.click(screen.getByRole('button', { name: /Analyze My App/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('合法的应用商店链接');
    expect(screen.getByText(/Step 1 of 2/)).toBeInTheDocument();
  });

  it('合法 App Store 链接分析后应进入第二步', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<LoginFlow onComplete={jest.fn()} />);

    await user.type(screen.getByLabelText(/App Store URL/i), 'https://apps.apple.com/app/id123456');
    await user.click(screen.getByRole('button', { name: /Analyze My App/i }));

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByText(/Step 2 of 2/)).toBeInTheDocument();
    expect(screen.getByText(/HomeDesign Studio/)).toBeInTheDocument();
  });

  it('确认应用信息后应回传完整数据', async () => {
    const onComplete = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<LoginFlow onComplete={onComplete} />);

    await user.type(
      screen.getByLabelText(/App Store URL/i),
      'https://play.google.com/store/apps/details?id=demo'
    );
    await user.click(screen.getByRole('button', { name: /Analyze My App/i }));

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    await user.click(screen.getByRole('button', { name: /Enter My Dashboard/i }));

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toMatchObject({
      name: 'HomeDesign Studio',
      category: 'lifestyle',
      subcategory: 'Interior Design',
    });
  });
});
