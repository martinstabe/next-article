<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:template match="a[@data-asset-type='interactive-graphic' and contains(@href, 'https')]">
      <iframe class="article__interactive" src="{@href}" width="{@data-width}" height="{@data-height}" scrolling="no"></iframe>
    </xsl:template>

</xsl:stylesheet>
