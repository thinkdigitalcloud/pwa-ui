import { useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { RiCheckLine, RiArrowRightLine } from 'react-icons/ri';
import { BsBuilding } from 'react-icons/bs';
import { Page, type PageProps } from '../Page';
import { Spinner } from '../Spinner';
import { Text } from '../Text';

/** An estate the user can switch into. */
export interface SwitchEstateEstate {
  /** Stable id (e.g. `EstateID`); used as the React key. */
  id: string | number;
  /** Display + join key. Must match `SwitchEstateRole.estateName`. */
  name: string;
  /** Logo/banner shown in the row; falls back to a building glyph. */
  imageUrl?: string;
}

/** A role the user holds at a given estate. */
export interface SwitchEstateRole {
  /** Join key against `SwitchEstateEstate.name`. */
  estateName: string;
  /** Internal role identifier (optional, passed straight back on select). */
  roleName?: string;
  /** Human-readable label shown in the role sheet. */
  roleDisplayName: string;
}

/** Payload handed to `onSwitch` when a role is chosen. */
export interface SwitchEstateSelection {
  estate: SwitchEstateEstate;
  role: SwitchEstateRole;
}

export interface SwitchEstateProps {
  /** All estates available to the user. */
  estates: SwitchEstateEstate[];
  /** All roles across estates; joined to estates by `estateName`. */
  roles: SwitchEstateRole[];
  /** Currently active estate name (drives the row check mark). */
  currentEstateName?: string;
  /** Currently active role display name (highlighted in the sheet). */
  currentRoleName?: string;
  /** Called when the user confirms an estate + role. */
  onSwitch: (selection: SwitchEstateSelection) => void;

  /** Show a blocking loading overlay. */
  loading?: boolean;

  /** Header title. Ignored if `header` is provided. */
  title?: string;
  /** Centred subtitle above the list. Hidden by default; pass a string to show. */
  subtitle?: string | null;
  /** Role action-sheet title. */
  roleSheetTitle?: string;
  /** Cancel button label in the role sheet. */
  cancelLabel?: string;
  /** Loading overlay label. */
  loadingLabel?: string;

  /** Background colour for highlighting the active role row. */
  activeRoleColor?: string;
  /** Colour of the selected-estate check mark (defaults to the theme success green). */
  checkColor?: string;

  /** Full Header props override (takes precedence over `title`). */
  header?: PageProps['header'];
  /** BottomNavigation props; omit to render no nav. */
  bottomNav?: PageProps['bottomNav'];
  /** Page background. */
  backgroundColor?: string;
}

const EstateImage = ({ imageUrl, name }: { imageUrl?: string; name: string }) => {
  const [failed, setFailed] = useState(!imageUrl);
  const [loaded, setLoaded] = useState(false);
  if (failed) {
    return (
      <FallbackWrap>
        <BsBuilding size={50} color="#d01e2d" />
        <span>{name}</span>
      </FallbackWrap>
    );
  }
  return (
    <StyledImg
      src={imageUrl}
      alt={name}
      style={{ display: loaded ? 'initial' : 'none' }}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
    />
  );
};

/**
 * Estate-switching screen (the apps' `/SwitchEstate`). Renders the user's
 * estates as full-width rows; tapping one opens a role action-sheet, and
 * confirming a role fires `onSwitch`. All data — estates, roles, the current
 * estate and current role — is supplied by the parent, so the component holds
 * no data-fetching or store logic and is fully reusable across apps.
 */
export function SwitchEstate({
  estates,
  roles,
  currentEstateName,
  currentRoleName,
  onSwitch,
  loading = false,
  title = 'Select Estate',
  subtitle = null,
  roleSheetTitle = 'Select a role',
  cancelLabel = 'Cancel',
  loadingLabel = 'Loading',
  activeRoleColor = '#FBB019',
  checkColor,
  header,
  bottomNav,
  backgroundColor = '#ffffff',
}: SwitchEstateProps) {
  const theme = useTheme();
  const [selectedEstateName, setSelectedEstateName] = useState<string | undefined>(
    currentEstateName,
  );
  const [roleSheetOpen, setRoleSheetOpen] = useState(false);

  // Only show estates the user actually holds a role at.
  const estatesWithRoles = useMemo(
    () => estates.filter((e) => roles.some((r) => r.estateName === e.name)),
    [estates, roles],
  );

  const selectedEstate = useMemo(
    () => estates.find((e) => e.name === selectedEstateName),
    [estates, selectedEstateName],
  );

  const selectedEstateRoles = useMemo(
    () => roles.filter((r) => r.estateName === selectedEstateName),
    [roles, selectedEstateName],
  );

  const openRolesFor = (estate: SwitchEstateEstate) => {
    setSelectedEstateName(estate.name);
    setRoleSheetOpen(true);
  };

  const chooseRole = (role: SwitchEstateRole) => {
    setRoleSheetOpen(false);
    if (selectedEstate) onSwitch({ estate: selectedEstate, role });
  };

  return (
    <Page
      header={header ?? { title, noBackButton: false }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
      padded={false}
    >
      {loading ? (
        <LoadingOverlay>
          <Spinner size={30} color={theme.colors.primary} text={loadingLabel} />
        </LoadingOverlay>
      ) : (
        <Column>
          {subtitle != null && (
            <Subtitle variant="label">{subtitle}</Subtitle>
          )}
          {estatesWithRoles.map((estate) => (
            <EstateRow
              key={estate.id}
              type="button"
              onClick={() => openRolesFor(estate)}
            >
              {estate.name === selectedEstateName && (
                <Check color={checkColor ?? theme.colors.success} />
              )}
              <EstateImage imageUrl={estate.imageUrl} name={estate.name} />
            </EstateRow>
          ))}
        </Column>
      )}

      {roleSheetOpen && (
        <Backdrop onClick={() => setRoleSheetOpen(false)}>
          <Sheet onClick={(e) => e.stopPropagation()}>
            <SheetTitle>{roleSheetTitle}</SheetTitle>
            <RoleList>
              {selectedEstateRoles.map((role, index) => {
                const active = role.roleDisplayName === currentRoleName;
                return (
                  <RoleRow
                    key={role.roleDisplayName}
                    type="button"
                    $active={active}
                    $last={index === selectedEstateRoles.length - 1}
                    $activeColor={activeRoleColor}
                    onClick={() => chooseRole(role)}
                  >
                    <RoleLabel $active={active}>{role.roleDisplayName}</RoleLabel>
                    <RiArrowRightLine color={theme.colors.primary} size={18} />
                  </RoleRow>
                );
              })}
            </RoleList>
            <CancelButton
              type="button"
              style={{ backgroundColor: theme.colors.primary }}
              onClick={() => setRoleSheetOpen(false)}
            >
              {cancelLabel}
            </CancelButton>
          </Sheet>
        </Backdrop>
      )}
    </Page>
  );
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Subtitle = styled(Text)`
  text-align: center;
  width: 100%;
  margin: 10px 0;
`;

/* RN parity (EstateSwitchScreen): full-width rows, top divider, no card
   shadow/radius; image centred; check mark on the right in theme.secondary. */
const EstateRow = styled.button`
  background: #fff;
  color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  min-height: 120px;
  padding: 0;
  border: none;
  border-top: 1px solid #f0f0f0;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
`;

const FallbackWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const StyledImg = styled.img`
  background: transparent;
  margin-top: 10px;
  height: 80px;
  max-width: 195px;
  width: 100%;
  object-fit: contain;
  align-self: center;
`;

const Check = styled(RiCheckLine)`
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
  font-size: xx-large;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: #343a4066;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

/* Role action-sheet (RN parity: ModalList) — white rounded card, highlighted
   active role, primary-coloured arrow per row and Cancel button. */
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
`;

const Sheet = styled.div`
  width: 90%;
  max-width: 480px;
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SheetTitle = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  color: #000;
  margin: 20px 0;
`;

const RoleList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const RoleRow = styled.button<{
  $active: boolean;
  $last: boolean;
  $activeColor: string;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 56px;
  padding: 0 35px;
  border: none;
  cursor: pointer;
  background: ${({ $active, $activeColor }) => ($active ? $activeColor : 'transparent')};
  border-bottom: ${({ $last }) => ($last ? 'none' : '1px solid #eee')};
`;

const RoleLabel = styled.span<{ $active: boolean }>`
  color: #000;
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
`;

const CancelButton = styled.button`
  width: 80%;
  align-self: center;
  height: 46px;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 15px;
  margin: 20px 0;
  cursor: pointer;
`;
