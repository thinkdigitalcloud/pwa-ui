import styled, { useTheme } from 'styled-components';
import { PiHouse } from 'react-icons/pi';
import { Page, type PageProps } from '../Page';
import { Spinner } from '../Spinner';
import { Text } from '../Text';
import { SelectTile } from '../SelectTile';

export interface UnitOption {
  unitNo: string | number;
  estate?: string;
  [key: string]: unknown;
}

export interface SelectUnitProps {
  units: UnitOption[];
  onSelectUnit: (unit: UnitOption) => void;

  loading?: boolean;
  /** Centred sub-heading above the grid. */
  subtitle?: string;
  /** Empty-state message when there are no units. */
  emptyText?: string;
  /** Build each tile's label (defaults to `Unit: {unitNo}`). */
  unitLabel?: (unit: UnitOption) => string;

  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

/**
 * The `/accounttypes` "Levy Statements" landing: a responsive grid of the
 * user's units; selecting one proceeds to the account-type screen. Data +
 * handler come from the parent.
 */
export function SelectUnit({
  units,
  onSelectUnit,
  loading = false,
  subtitle = 'Select Unit Number',
  emptyText = 'No properties found. Please add an address in your profile to proceed.',
  unitLabel = (u) => `Unit: ${u.unitNo}`,
  title = 'Levy Statements',
  header,
  bottomNav,
  backgroundColor = '#ffffff',
}: SelectUnitProps) {
  const theme = useTheme();
  return (
    <Page
      header={header ?? { title, noBackButton: false }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
    >
      {loading && (
        <Overlay>
          <Spinner size={30} color={theme.colors.danger} text="Loading" />
        </Overlay>
      )}
      <Column>
        {subtitle && <Subtitle color={theme.colors.text}>{subtitle}</Subtitle>}
        {units.length > 0 ? (
          <Grid>
            {units.map((unit, i) => (
              <Cell key={`${unit.unitNo}_${i}`}>
                <SelectTile
                  label={unitLabel(unit)}
                  icon={<PiHouse size={28} color={theme.colors.danger} />}
                  onClick={() => onSelectUnit(unit)}
                />
              </Cell>
            ))}
          </Grid>
        ) : (
          !loading && <Empty color={theme.colors.danger}>{emptyText}</Empty>
        )}
      </Column>
    </Page>
  );
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Subtitle = styled(Text)`
  align-self: center;
  font-size: 16px;
  padding: 15px 30px;
  margin-top: 15px;
`;

const Grid = styled.div`
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 18px 0;
  margin-top: 10px;
`;

const Cell = styled.div`
  width: 47%;
`;

const Empty = styled(Text)`
  text-align: center;
  padding: 15px 30px;
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
