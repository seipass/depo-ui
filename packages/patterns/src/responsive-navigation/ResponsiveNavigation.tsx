import { useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Button, Drawer, SideNav, TopNav, type SideNavItem } from '@depo-ui/components';

export type ResponsiveNavigationProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'className'
> & {
  brand: ReactNode;
  items: readonly SideNavItem[];
  children?: ReactNode;
  actions?: ReactNode;
  mobileOpen?: boolean;
  defaultMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  className?: string;
};

export function ResponsiveNavigation({
  brand,
  items,
  children,
  actions,
  mobileOpen: openProp,
  defaultMobileOpen = false,
  onMobileOpenChange,
  className,
  ...props
}: ResponsiveNavigationProps) {
  const [internalOpen, setInternalOpen] = useState(defaultMobileOpen);
  const open = openProp ?? internalOpen;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next);
    onMobileOpenChange?.(next);
  };
  const mobileTrigger = <Button aria-label="Open navigation">Menu</Button>;
  return (
    <div
      {...props}
      className={className}
      data-dui-pattern="responsive-navigation"
      data-state={open ? 'open' : 'closed'}
    >
      <TopNav actions={actions} brand={brand} items={items} />
      <div data-dui-pattern-navigation="">
        <SideNav items={items} label="Primary navigation" />
        <Drawer
          defaultOpen={defaultMobileOpen}
          onOpenChange={setOpen}
          open={open}
          title="Navigation"
          trigger={mobileTrigger}
        >
          <SideNav items={items} label="Mobile navigation" />
        </Drawer>
      </div>
      <main>{children}</main>
    </div>
  );
}
