import classNames from 'classnames';
import React from 'react';
import { Button, Checkbox, Icon, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import ErrorDialog from 'Components/error-dialog';
import './transfer-confirm.scss';

type TRowProps = {
    item_key?: string | number;
    label: string | Array<string>;
    value: string | Array<string> | JSX.Element;
    key: string | number;
};

type WarningBulletProps = {
    children: JSX.Element | string;
};

type TTransferConfirmProps = {
    data: Array<TRowProps>;
    error?: object;
    header?: string;
    is_payment_agent_withdraw?: boolean;
    onClickBack?: () => void;
    onClickConfirm?: () => void;
    warning_messages?: Array<JSX.Element>;
};

const Row = ({ item_key, label, value }: TRowProps) => (
    <div className='transfer-confirm__row'>
        {Array.isArray(label) ? (
            <div className='transfer-confirm__row-label'>
                {label.map((label_text, idx) => (
                    <Text as='div' key={idx} size='xs' align='left'>
                        {label_text}
                    </Text>
                ))}
            </div>
        ) : (
            <Text size='xs'>{label}</Text>
        )}
        {Array.isArray(value) ? (
            <div className='transfer-confirm__row-value'>
                {value.map((v, idx) => (
                    <Text as='div' key={idx} size='xs' weight='bold' align='right'>
                        {v}
                    </Text>
                ))}
            </div>
        ) : (
            <Text
                size='xs'
                weight='bold'
                align='right'
                className={classNames({
                    description: item_key === 'description',
                })}
            >
                {value}
            </Text>
        )}
    </div>
);

const WarningBullet = ({ children }: WarningBulletProps) => (
    <div className='transfer-confirm__warnings-bullet-wrapper'>
        <div className='transfer-confirm__warnings-bullet' />
        {children}
    </div>
);

const TransferConfirm = ({
    data,
    error,
    is_payment_agent_withdraw,
    onClickBack,
    onClickConfirm,
}: TTransferConfirmProps) => {
    const [is_transfer_consent_checked, setIsTransferConsentChecked] = React.useState(false);

    const warning_messages = [
        <Localize
            i18n_default_text='Please ensure <0>all details</0> are <0>correct</0> before making your transfer.'
            components={[<strong key={0} />]}
            key={0}
        />,
        <Localize
            i18n_default_text='We <0>do not</0> guarantee a refund if you make a wrong transfer.'
            components={[<strong key={0} />]}
            key={1}
        />,
    ];

    return (
        <div
            className={classNames('cashier__wrapper--align-center', {
                'transfer-confirm': !is_payment_agent_withdraw,
            })}
        >
            <Icon
                icon='IcCashierRedWarning'
                className='transfer-confirm__warning-icon'
                data_testid='dt_red_warning_icon'
            />
            <Text
                as='h2'
                color='loss-danger'
                weight='bold'
                align='center'
                className='transfer-confirm__warning-icon__description'
                size={isMobile() ? 'xs' : 's'}
            >
                {is_payment_agent_withdraw
                    ? localize('Funds transfer information')
                    : localize('Check transfer information')}
            </Text>
            <div className='transfer-confirm__column-wrapper'>
                <div className='transfer-confirm__column'>
                    {data.map((d, key) => (
                        <Row item_key={key} label={d.label} value={d.value} key={key} />
                    ))}
                </div>
            </div>
            <div className='transfer-confirm__warnings'>
                {warning_messages.map((warning, idx) => (
                    <WarningBullet key={idx}>
                        <Text as='p' size='xxs' line_height='m' color='loss-danger' align='left'>
                            {warning}
                        </Text>
                    </WarningBullet>
                ))}
            </div>
            <div className='transfer-confirm__checkbox'>
                <Checkbox
                    name='transfer_consent'
                    value={is_transfer_consent_checked}
                    onChange={() => setIsTransferConsentChecked(!is_transfer_consent_checked)}
                    label={
                        is_payment_agent_withdraw
                            ? localize('I confirm that I have verified the payment agent’s transfer information.')
                            : localize('I confirm that I have verified the client’s transfer information.')
                    }
                    classNameLabel='transfer-confirm__checkbox-label'
                />
            </div>
            <div className='transfer-confirm__submit'>
                <Button large text={localize('Back')} onClick={onClickBack} secondary />
                <Button
                    large
                    text={localize('Transfer now')}
                    onClick={onClickConfirm}
                    primary
                    disabled={!is_transfer_consent_checked}
                />
            </div>
            <ErrorDialog error={error} />
        </div>
    );
};

export default TransferConfirm;
