import { Component } from '@angular/core';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

@Component({
  selector: 'app-rich-text',
  standalone: true,
  imports: [AngularEditorModule, FormsModule, LMarkdownEditorModule],
  templateUrl: './rich-text.component.html',
})
export class RichTextComponent {
  public editorContent: string = '<p><b>Titulo</b></p>\n\n<p>Lista de itens:</p>\n\n<ul>\n\t<li>Item 1</li>\n\t<li>Item 2</li>\n\t<li>Item 3</li>\n</ul>\n\n\n<p>Lista de itens numerada:</p>\n\n<ol>\n\t<li>Item 1</li>\n\t<li>Item 2\n\t<ol>\n\t\t<li>Item 2.1\n\t\t<ol>\n\t\t\t<li>Item 2.1.1\n\t\t\t<ol>\n\t\t\t\t<li>Item 2.1.1.1</li>\n\t\t\t</ol>\n\t\t\t</li>\n\t\t</ol>\n\t\t</li>\n\t</ol>\n\t</li>\n\t<li>Item 3</li>\n</ol>\n\n\n<p><a href=\"https://www.google.com\" class=\"external-link\" rel=\"nofollow noreferrer\">Texto com link</a></p>\n\n<p>Menção de card </p>\n\n<p>Imagem:</p>\n\n<p><span class=\"image-wrap\" style=\"\"><img src=\"/rest/api/3/attachment/content/153288\" width=\"50%\" style=\"border: 0px solid black\" /></span></p>\n\n<p><b>Texto em negrito</b></p>\n\n<p><em>Texto em itálico</em></p>\n\n<p><b><em>texto em itálico e negrito</em></b></p>\n\n<p><ins>Texto com Underline</ins></p>\n\n<p><del>Texto cortado</del></p>\n\n<p><sub>Texto com subscript</sub></p>\n\n<p><sup>Texto superscript</sup></p>';
}
