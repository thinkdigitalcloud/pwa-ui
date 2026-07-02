import styled from 'styled-components';
import { Page, type PageProps } from '../Page';
import { ListRow } from '../ListRow';
import { Text } from '../Text';
import { useResolvedTheme } from '../../theme/useResolvedTheme';

/** A label/value info row (e.g. App Version → 2.0.1). */
export interface AboutRow {
  label: string;
  value?: string;
}

/** A tappable link row (e.g. Terms, Privacy, Website). */
export interface AboutLink {
  label: string;
  onClick: () => void;
}

export interface AboutPageProps {
  title?: string;
  onBack?: () => void;
  noBackButton?: boolean;
  /** App logo shown above the name. */
  logo?: string;
  appName?: string;
  description?: string;
  /** Info rows (label left, value right). Defaults to nothing. */
  rows?: AboutRow[];
  /** Link rows rendered with a trailing arrow below the info rows. */
  links?: AboutLink[];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

/**
 * The `/about` screen. In the apps this is minimal (a single "App Version" row),
 * so `rows` drives the core content; the optional logo / app name / description
 * and `links` (terms, privacy, website…) let richer About pages reuse the same
 * layout.
 */
export function AboutPage({
  title = 'About',
  onBack,
  noBackButton = false,
  logo,
  appName,
  description,
  rows = [],
  links = [],
  bottomNav,
  backgroundColor,
}: AboutPageProps) {
  const theme = useResolvedTheme();
  const bg = backgroundColor ?? theme.colors.background;
  const hasHeaderBlock = Boolean(logo || appName || description);

  return (
    <Page
      header={{ title, onBack, noBackButton }}
      bottomNav={bottomNav}
      backgroundColor={bg}
      padded={false}
    >
      {hasHeaderBlock && (
        <HeaderBlock>
          {logo && <Logo src={logo} alt={appName ?? 'logo'} />}
          {appName && <Text variant="heading" color={theme.colors.text}>{appName}</Text>}
          {description && (
            <Text variant="small" color={theme.colors.textMuted} style={{ textAlign: 'center', marginTop: 6 }}>
              {description}
            </Text>
          )}
        </HeaderBlock>
      )}

      {rows.map((row) => (
        <Row key={row.label} style={{ borderBottomColor: theme.colors.lightGrey }}>
          <Text variant="body" color={theme.colors.text}>{row.label}</Text>
          {row.value != null && (
            <Text variant="body" color={theme.colors.text}>{row.value}</Text>
          )}
        </Row>
      ))}

      {links.length > 0 && (
        <Links>
          {links.map((link) => (
            <ListRow key={link.label} title={link.label} hasArrow arrowColor={theme.colors.text} onClick={link.onClick} />
          ))}
        </Links>
      )}
    </Page>
  );
}

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px;
`;

const Logo = styled.img`
  width: 96px;
  height: 96px;
  object-fit: contain;
  margin-bottom: 12px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 0.5px solid;
`;

const Links = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
`;
