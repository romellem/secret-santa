#import <AppKit/AppKit.h>
int main(int argc, const char *argv[]) { @autoreleasepool {
  NSString *name = [NSString stringWithUTF8String:argv[1]];
  NSImage *image = [[NSImage alloc] initWithSize:NSMakeSize(1200, 630)];
  [image lockFocus];
  [[NSColor colorWithRed:.07 green:.24 blue:.20 alpha:1] setFill]; NSRectFill(NSMakeRect(0,0,1200,630));
  [[NSColor colorWithRed:.82 green:.69 blue:.43 alpha:1] setStroke];
  NSBezierPath *border = [NSBezierPath bezierPathWithRoundedRect:NSMakeRect(24,24,1152,582) xRadius:24 yRadius:24]; border.lineWidth = 3; [border stroke];
  NSMutableParagraphStyle *style = [NSMutableParagraphStyle new]; style.alignment = NSTextAlignmentCenter;
  NSColor *cream = [NSColor colorWithRed:1 green:.97 blue:.88 alpha:1];
  NSColor *gold = [NSColor colorWithRed:.92 green:.79 blue:.54 alpha:1];
  NSArray *lines = @[@"✦   A LITTLE HOLIDAY MAGIC   ✦", @"Secret Santa", [@"for " stringByAppendingString:name.length > 30 ? [[name substringToIndex:27] stringByAppendingString:@"…"] : name], @"Your surprise is waiting inside"];
  CGFloat sizes[] = {29, 82, name.length > 18 ? 52 : 72, 30}; CGFloat ys[] = {475,330,225,115};
  for (int i=0; i<4; i++) [lines[i] drawInRect:NSMakeRect(70,ys[i],1060,sizes[i]*1.6) withAttributes:@{NSFontAttributeName:[NSFont systemFontOfSize:sizes[i] weight:i==1 ? NSFontWeightBold : NSFontWeightMedium], NSForegroundColorAttributeName:i==0 || i==3 ? gold : cream, NSParagraphStyleAttributeName:style}];
  [image unlockFocus];
  NSBitmapImageRep *bitmap = [NSBitmapImageRep imageRepWithData:image.TIFFRepresentation];
  [[bitmap representationUsingType:NSBitmapImageFileTypePNG properties:@{}] writeToFile:[NSString stringWithUTF8String:argv[2]] atomically:YES];
} return 0; }
