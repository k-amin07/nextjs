import Image from "next/image";

type Props = {
    src: string,
    alt: string,
    priority?: string
}

export default function CustomImage({ src, alt, priority }: Props) {
    const prrty = priority ? true : false;
    return (
        <div className="w-full h-full">
            <Image className="rounded-lg max:auto"
                src={src}
                alt={alt}
                width={650}
                height={650}
                priority={prrty}
            />
        </div>
    )
}