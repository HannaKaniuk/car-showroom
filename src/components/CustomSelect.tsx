import { type KeyboardEvent, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface CustomSelectProps<T extends string> {
  id: string;
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  invalid?: boolean;
  describedBy?: string;
}

const MENU_GAP = 8;
const MENU_MAX_HEIGHT = 240;

function positionMenu(menu: HTMLElement, trigger: HTMLElement) {
  const rect = trigger.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom - MENU_GAP;
  const spaceAbove = rect.top - MENU_GAP;
  const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
  const maxHeight = Math.min(MENU_MAX_HEIGHT, openUp ? spaceAbove : spaceBelow);

  menu.style.setProperty('--menu-left', `${rect.left}px`);
  menu.style.setProperty('--menu-width', `${rect.width}px`);
  menu.style.setProperty('--menu-max-height', `${maxHeight}px`);

  if (openUp) {
    menu.style.removeProperty('--menu-top');
    menu.style.setProperty('--menu-bottom', `${window.innerHeight - rect.top + MENU_GAP}px`);
  } else {
    menu.style.removeProperty('--menu-bottom');
    menu.style.setProperty('--menu-top', `${rect.bottom + MENU_GAP}px`);
  }
}

export function CustomSelect<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  invalid = false,
  describedBy,
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selected = options.find((option) => option.value === value) ?? options[0];

  useLayoutEffect(() => {
    triggerRef.current?.setAttribute('aria-expanded', open ? 'true' : 'false');
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !menuRef.current) return;

    const update = () => {
      if (triggerRef.current && menuRef.current) {
        positionMenu(menuRef.current, triggerRef.current);
      }
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, options.length]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function selectOption(optionValue: T) {
    onChange(optionValue);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLDivElement>, optionValue: T) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectOption(optionValue);
    }
  }

  const menu = open
    ? createPortal(
        <div
          ref={menuRef}
          id={listboxId}
          className="custom-select__menu"
          role="listbox"
          aria-label={label}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <div
                key={option.value}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                className={`custom-select__option${
                  isSelected ? ' custom-select__option--selected' : ''
                }`}
                onClick={() => selectOption(option.value)}
                onKeyDown={(event) => handleOptionKeyDown(event, option.value)}
              >
                {option.label}
              </div>
            );
          })}
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="custom-select" ref={rootRef}>
      <label id={`${id}-label`} htmlFor={`${id}-trigger`}>
        {label}
      </label>

      <button
        ref={triggerRef}
        id={`${id}-trigger`}
        type="button"
        className={`custom-select__trigger ${open ? 'custom-select__trigger--open' : ''} ${
          invalid ? 'field-control--invalid' : ''
        }`}
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-labelledby={`${id}-label ${id}-trigger`}
        aria-controls={listboxId}
        {...(describedBy ? { 'aria-describedby': describedBy } : {})}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{selected.label}</span>
        <span className="custom-select__chevron" aria-hidden="true" />
      </button>

      {menu}
    </div>
  );
}
