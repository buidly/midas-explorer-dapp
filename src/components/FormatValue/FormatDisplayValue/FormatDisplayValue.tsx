import classNames from 'classnames';

import { MAX_DISPLAY_ZERO_DECIMALS, ZERO } from 'appConstants';
import { FormatAmountUIType, Overlay } from 'components';
import { DIGITS } from 'config';

export interface FormatDisplayValueUIType
  extends Omit<FormatAmountUIType, 'value'> {
  formattedValue: string | number;
  completeValue: string | number;
  symbol?: React.ReactNode;
  label?: React.ReactNode;
  details?: React.ReactNode;
  showTooltipSymbol?: boolean;
  showTooltipLabel?: boolean;
  spacedLabel?: boolean;
}

export const FormatDisplayValue = (props: FormatDisplayValueUIType) => {
  const {
    formattedValue,
    completeValue,
    token,
    symbol,
    label,
    egldLabel,
    details,
    digits = DIGITS,
    showLastNonZeroDecimal = false,
    showLabel = true,
    showTooltip = true,
    showSymbol = false,
    superSuffix = false,
    showTooltipSymbol = false,
    showTooltipLabel = false,
    spacedLabel = false,
    className
  } = props;

  const valueParts = String(formattedValue).split('.');
  const isZero = Number(completeValue) === 0;
  const displayLabel = label ?? (token ? token : egldLabel);

  const DisplayValue = () => {
    const completeValueParts = String(completeValue).split('.');
    const decimalArray = completeValueParts?.[1]?.split('') ?? [];
    const areAllDigitsZeroes = decimalArray.every((digit) => digit === ZERO);
    if (!showLastNonZeroDecimal && formattedValue !== completeValue) {
      const firstNonZeroIndex = decimalArray.findIndex(
        (digit) => digit !== ZERO
      );
      const nonZeroDecimals = [];

      for (let i = firstNonZeroIndex; i <= decimalArray.length - 1; i++) {
        if (nonZeroDecimals.length < Math.max(digits, 2)) {
          nonZeroDecimals.push(decimalArray[i]);
        }
      }

      if (firstNonZeroIndex > MAX_DISPLAY_ZERO_DECIMALS) {
        return (
          <>
            <span className='am'>{valueParts[0]}</span>
            <span className='dec'>
              .0<sub>{firstNonZeroIndex - 2}</sub>0{nonZeroDecimals.join('')}
            </span>
          </>
        );
      }
    }

    return (
      <>
        <span className='am'>{valueParts[0]}</span>
        {valueParts[1] && !areAllDigitsZeroes && (
          <span className='dec'>.{valueParts[1]}</span>
        )}
      </>
    );
  };

  const showCompleteValue =
    completeValue !== formattedValue &&
    String(completeValue).length > String(formattedValue).length &&
    !isZero;
  const displayTooltip = showTooltip && (details || showCompleteValue);

  return (
    <span
      className={classNames(className, 'fam')}
      {...(props['data-testid'] ? { 'data-testid': props['data-testid'] } : {})}
    >
      {showSymbol && symbol && <>{symbol}</>}
      {displayTooltip ? (
        <Overlay
          title={
            <>
              {showCompleteValue && (
                <>
                  {showSymbol && showTooltipSymbol && symbol && <>{symbol}</>}
                  {completeValue}
                  {showLabel && showTooltipLabel && displayLabel && (
                    <>
                      {spacedLabel && <>&nbsp;</>}
                      {displayLabel}
                    </>
                  )}
                </>
              )}
              {details ? (
                <>
                  {showCompleteValue && <br />}
                  {details}
                </>
              ) : null}
            </>
          }
          persistent
          truncate
        >
          <DisplayValue />
        </Overlay>
      ) : (
        <DisplayValue />
      )}
      {showLabel && displayLabel && (
        <>
          {superSuffix ? (
            <sup className='suf'>{displayLabel}</sup>
          ) : (
            <span className='suf'>
              {spacedLabel && <>&nbsp;</>}
              {displayLabel}
            </span>
          )}
        </>
      )}
    </span>
  );
};
