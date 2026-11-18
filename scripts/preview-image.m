#import <AppKit/AppKit.h>
int main(int argc, const char *argv[]) { @autoreleasepool {
  NSString *name = [NSString stringWithUTF8String:argv[1]];
  NSImage *image = [[NSImage alloc] initWithSize:NSMakeSize(1200, 630)];
  [image lockFocus];
  [[NSColor colorWithRed:.07 green:.24 blue:.20 alpha:1] setFill]; NSRectFill(NSMakeRect(0,0,1200,630));
  // A reproducible, subtle paper grain keeps every generated tag consistent.
  uint32_t seed = 2026;
  for (int i = 0; i < 42000; i++) {
    seed = seed * 1664525u + 1013904223u; CGFloat x = seed % 1200;
    seed = seed * 1664525u + 1013904223u; CGFloat y = seed % 630;
    [[NSColor colorWithWhite:(i % 2 ? 1 : 0) alpha:.035] setFill];
    NSRectFillUsingOperation(NSMakeRect(x, y, 1, 1), NSCompositingOperationSourceOver);
  }
  [[NSColor colorWithRed:.82 green:.69 blue:.43 alpha:1] setStroke];
  NSBezierPath *border = [NSBezierPath bezierPathWithRoundedRect:NSMakeRect(24,24,1152,582) xRadius:24 yRadius:24]; border.lineWidth = 3; [border stroke];
  // Reinforced hole at the left edge, like a gift tag ready for ribbon.
  [[NSColor colorWithRed:.82 green:.69 blue:.43 alpha:1] setStroke];
  NSBezierPath *eyelet = [NSBezierPath bezierPathWithOvalInRect:NSMakeRect(62, 280, 70, 70)];
  eyelet.lineWidth = 3; [eyelet stroke];
  [[NSColor colorWithRed:.035 green:.12 blue:.10 alpha:1] setFill];
  [[NSBezierPath bezierPathWithOvalInRect:NSMakeRect(76, 294, 42, 42)] fill];
  NSMutableParagraphStyle *style = [NSMutableParagraphStyle new]; style.alignment = NSTextAlignmentCenter;
  NSColor *cream = [NSColor colorWithRed:1 green:.97 blue:.88 alpha:1];
  NSColor *gold = [NSColor colorWithRed:.92 green:.79 blue:.54 alpha:1];
  NSArray *lines = @[@"✦   MERRY CHRISTMAS   ✦", @"Secret Santa", [@"for " stringByAppendingString:name.length > 30 ? [[name substringToIndex:27] stringByAppendingString:@"…"] : name]];
  CGFloat sizes[] = {29, 82, name.length > 18 ? 52 : 72}; CGFloat ys[] = {397,252,147};
  for (int i=0; i<3; i++) [lines[i] drawInRect:NSMakeRect(135,ys[i],995,sizes[i]*1.6) withAttributes:@{NSFontAttributeName:[NSFont systemFontOfSize:sizes[i] weight:i==1 ? NSFontWeightBold : NSFontWeightMedium], NSForegroundColorAttributeName:i==0 ? gold : cream, NSParagraphStyleAttributeName:style}];
  [image unlockFocus];
  NSBitmapImageRep *bitmap = [NSBitmapImageRep imageRepWithData:image.TIFFRepresentation];
  [[bitmap representationUsingType:NSBitmapImageFileTypePNG properties:@{}] writeToFile:[NSString stringWithUTF8String:argv[2]] atomically:YES];
} return 0; }
