import { PiFilePlus } from 'react-icons/pi';
import styled, { useTheme } from 'styled-components';
import { Page, type PageProps } from '../Page';
import { Spinner } from '../Spinner';
import { Text } from '../Text';
import { NoData } from '../NoData';

export interface AccountTypeItem {
  name: string;
  image: string;
  value?: string;
}

export interface AccountTypeSection {
  title: string;
  items: AccountTypeItem[];
}

export interface AccountTypesProps {
  /** Grouped account-type cards (e.g. "Estate Levies" → [Levies]). */
  sections: AccountTypeSection[];
  onSelectType: (item: AccountTypeItem) => void;
  /** Header "add account" action — omit to hide it. */
  onAddAccount?: () => void;

  loading?: boolean;
  /** Empty state (no linked accounts). */
  emptyTitle?: string;
  emptyText?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;

  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

/**
 * The `/accounttypesselect` page (balwin BillTypeScreen): the selected unit's
 * account types as logo cards, grouped by section, with a header "add account"
 * action and a NoData empty state. Data + handlers come from the parent; the
 * multi-account picker (when a type has several accounts) is the parent's job.
 */
export function AccountTypes({
  sections,
  onSelectType,
  onAddAccount,
  loading = false,
  emptyTitle = 'No Accounts',
  emptyText = 'You have no accounts linked to your profile yet. Would you like to add one?',
  onEmptyAction,
  emptyActionLabel = 'Go to accounts',
  title = 'Levy Statements',
  header,
  bottomNav,
  backgroundColor = '#ffffff',
}: AccountTypesProps) {
  const theme = useTheme();
  const hasAccounts = sections.some((s) => s.items.length > 0);

  const resolvedHeader =
    header ??
    {
      title,
      noBackButton: false,
      actions: onAddAccount
        ? [
            {
              key: 'add',
              label: 'Add Account',
              icon: <PiFilePlus size={26} />,
              color: theme.colors.success,
              onClick: onAddAccount,
            },
          ]
        : undefined,
    };

  return (
    <Page header={resolvedHeader} bottomNav={bottomNav} backgroundColor={backgroundColor}>
      {loading && (
        <Overlay>
          <Spinner size={30} color={theme.colors.danger} text="Loading" />
        </Overlay>
      )}
      <Container>
        {hasAccounts ? (
          sections.map((section) =>
            section.items.length > 0 ? (
              <Section key={section.title}>
                <SectionTitle color={theme.colors.text}>{section.title}</SectionTitle>
                {section.items.map((item, idx) => (
                  <TypeCard key={`${item.name}_${idx}`} type="button" onClick={() => onSelectType(item)}>
                    <Logo src={item.image} alt={item.name} />
                  </TypeCard>
                ))}
              </Section>
            ) : null,
          )
        ) : (
          !loading && (
            <NoData
              title={emptyTitle}
              text={emptyText}
              onAction={onEmptyAction}
              actionLabel={emptyActionLabel}
            />
          )
        )}
      </Container>
    </Page>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px 15px 100px;
  box-sizing: border-box;
`;

const Section = styled.div`
  width: 100%;
`;

const SectionTitle = styled(Text)`
  display: block;
  margin: 25px 5px -10px;
`;

const TypeCard = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px;
  margin-top: 20px;
  border: none;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

const Logo = styled.img`
  height: 80%;
  object-fit: contain;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: #343a4066;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
