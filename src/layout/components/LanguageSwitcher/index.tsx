import { Dropdown, Button } from 'antd';
import { currentLocaleSelector, setLocaleAction } from '@/store/modules/global';
import { useAppSelector, useAppDispatch } from '@/store';
import type { LocaleKey } from '@/interface/system';
import type { MenuProps } from 'antd';

const languageNames: Record<string, string> = {
  'zh-CN': '中文',
  'en-US': 'English',
};

export default function LanguageSwitcher() {
  const dispatch = useAppDispatch();
  const currentLocale = useAppSelector(currentLocaleSelector);

  const items: MenuProps['items'] = [
    { key: 'zh-CN', label: '中文', disabled: currentLocale === 'zh-CN' },
    { key: 'en-US', label: 'English', disabled: currentLocale === 'en-US' },
  ];

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    dispatch(setLocaleAction(key as LocaleKey));
  };

  return (
    <Dropdown menu={{ items, onClick: handleClick }}>
      <Button type="text">{languageNames[currentLocale]}</Button>
    </Dropdown>
  );
}
