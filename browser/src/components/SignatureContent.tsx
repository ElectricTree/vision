import { useContext } from "react";
import { Author } from "src/types/common/server-api";
import dayjs from "dayjs";
import "./SignatureContent.css";
import { Checkmark } from "./core/Checkmark";
import { SignaturesContext } from "src/pages/Main";

function truncateWallet(address: string) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

function getTwitterDisplay(
  { twitterVerified, twitterUsername }: Author,
  { hideUsername }: { hideUsername?: boolean } = {}
) {
  const twitterUrl =
    twitterUsername && `https://twitter.com/${twitterUsername}`;

  if (!twitterUrl) {
    return;
  }

  return (
    <button
      onClick={() => {
        window.open(twitterUrl, "_blank");
      }}
      className={`twitterName`}
    >
      @{twitterUsername}{" "}
      {twitterVerified && (
        <span>
          <Checkmark />
        </span>
      )}
    </button>
  );
}

export function getTextDisplayForAuthor(
  { name, walletId }: Author,
  shouldTruncate?: boolean
): React.ReactNode {
  const walletAddr = shouldTruncate ? truncateWallet(walletId) : walletId;
  const nameDisplay = name || walletAddr;
  return nameDisplay;
}

// TODO: get ENS?
export function getDisplayForAuthor(
  author: Author,
  shouldTruncate?: boolean
): React.ReactNode {
  const { twitterVerified, twitterUsername } = author;
  const nameDisplay = getTextDisplayForAuthor(author, shouldTruncate);
  const twitterUrl =
    twitterUsername &&
    twitterVerified &&
    `https://twitter.com/${twitterUsername}`;
  return (
    <span className="inline gap-1">
      {nameDisplay}{" "}
      {twitterUrl && (
        <button
          style={{
            verticalAlign: "middle",
            top: "-3px",
            position: "relative",
          }}
          onClick={() => {
            window.open(twitterUrl, "_blank");
          }}
        >
          <Checkmark />
        </button>
      )}
    </span>
  );
}

export function getMinuteTimeOfDayDateDisplay(date: dayjs.Dayjs): string {
  const localHour = date.local().hour();
  return date.format(
    `MMM D, YYYY [on minute] m ${
      localHour >= 6 && localHour < 18 ? "[in the day] ☀️" : "[in the night] 🌙"
    }`
  );
}

export function Signature({ author }: { author: Author }) {
  const { createdAt, name, walletId } = author;
  const nameDisplay = name || walletId;
  const date = dayjs(createdAt, { utc: true });
  const dateDisplay = getMinuteTimeOfDayDateDisplay(date);

  // TODO: add location

  return (
    <p className="pb-0 pt-4">
      <div className="signature">
        <div className="display">
          <b>{nameDisplay}</b>
          <span className="date">signed {dateDisplay}</span>
        </div>
        <div className="twitter">{getTwitterDisplay(author)}</div>
      </div>
    </p>
  );
}

export function SignatureContent() {
  const { signatures } = useContext(SignaturesContext);

  return (
    <div className="signatureContainer">
      <h2 className="text-4xl font-bold mb-2 text-center">Signatures</h2>
      {signatures.map((author) => (
        <Signature author={author} />
      ))}
    </div>
  );
}
