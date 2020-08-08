export default class Lines {
  private lines: string = '';
  private index: number = 0;

  public get toString(): string {
    return this.lines;
  }

  public addText(title: string, text: string): void {
    if (this.index > 0)
      this.lines += '\n\n';

    this.lines += title;
    this.lines += '\n';
    this.lines += text;

    this.index++;
  }

  public addTexts(title: string, flags: any[], texts: string[]): void {
    if (this.index > 0)
      this.lines += '\n\n';

    this.lines += title;

    for (let i = 0; i < flags.length; i++)
      if (flags[i]) {
        this.lines += '\n';
        this.lines += texts[i];
      }

      this.index++;
  }
}
