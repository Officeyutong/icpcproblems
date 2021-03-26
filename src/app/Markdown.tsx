import React from "react";
import showdown from "showdown";


const converter = new showdown.Converter({
    extensions: [
    ],
    tables: true,
    literalMidWordUnderscores: true,
    strikethrough: true
});



const Markdown: React.FC<{ markdown: string }> = ({ markdown }) =>
    <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(markdown) }}  >

    </div>;
export { converter, Markdown };