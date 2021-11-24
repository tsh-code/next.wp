import Link from "next/link";

import { Author as AvatarProps } from "api/posts.types";
import styles from "./Avatar.module.scss";
import Image from "next/image";

const AVATAR_SIZE = 30;

export const Avatar = ({ name, slug, avatar }: AvatarProps) => {
  const href = `/author/${slug}/`;

  return (
    <div className={styles.wrapper}>
      <Link href={href}>
        <a className={styles.avatar}>
          <Image src={avatar.url} alt={`Avatar użytkownika ${name}`} width={AVATAR_SIZE} height={AVATAR_SIZE} />
        </a>
      </Link>
      <Link href={href}>
        <a className={styles.name}>{name}</a>
      </Link>
    </div>
  );
};
